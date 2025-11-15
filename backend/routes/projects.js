const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const Project = require('../models/Project');
const Task = require('../models/Task');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');

// @route   GET /api/projects
// @desc    Get all projects for logged-in user
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const projects = await Project.find({
      members: req.user._id
    })
    .populate('owner', 'name email avatar')
    .populate('members', 'name email avatar')
    .sort('-createdAt');

    res.json({
      success: true,
      count: projects.length,
      data: { projects }
    });
  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   POST /api/projects
// @desc    Create a new project
// @access  Private
router.post('/', auth, [
  body('name').trim().notEmpty().withMessage('Project name is required')
    .isLength({ min: 3, max: 100 }).withMessage('Project name must be between 3-100 characters'),
  body('description').optional().trim().isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters')
], validate, async (req, res) => {
  try {
    const { name, description } = req.body;

    const project = new Project({
      name,
      description,
      owner: req.user._id,
      members: [req.user._id]
    });

    await project.save();
    await project.populate('owner', 'name email avatar');
    await project.populate('members', 'name email avatar');

    // Emit socket event
    const io = req.app.get('io');
    io.emit('projectCreated', project);

    res.status(201).json({
      success: true,
      message: 'Project created successfully',
      data: { project }
    });
  } catch (error) {
    console.error('Create project error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   GET /api/projects/:id
// @desc    Get project by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('owner', 'name email avatar')
      .populate('members', 'name email avatar');

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Check if user is a member
    if (!project.members.some(member => member._id.toString() === req.user._id.toString())) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Get tasks for this project
    const tasks = await Task.find({ project: project._id })
      .populate('assignedTo', 'name email avatar')
      .populate('createdBy', 'name email avatar')
      .sort('-createdAt');

    res.json({
      success: true,
      data: { 
        project,
        tasks
      }
    });
  } catch (error) {
    console.error('Get project error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   PUT /api/projects/:id
// @desc    Update project
// @access  Private
router.put('/:id', auth, [
  body('name').optional().trim().isLength({ min: 3, max: 100 })
    .withMessage('Project name must be between 3-100 characters'),
  body('description').optional().trim().isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters'),
  body('status').optional().isIn(['active', 'completed', 'archived'])
    .withMessage('Invalid status')
], validate, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Check if user is owner
    if (project.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Only project owner can update'
      });
    }

    const { name, description, status } = req.body;
    
    if (name) project.name = name;
    if (description !== undefined) project.description = description;
    if (status) project.status = status;

    await project.save();
    await project.populate('owner', 'name email avatar');
    await project.populate('members', 'name email avatar');

    // Emit socket event
    const io = req.app.get('io');
    io.to(project._id.toString()).emit('projectUpdated', project);

    res.json({
      success: true,
      message: 'Project updated successfully',
      data: { project }
    });
  } catch (error) {
    console.error('Update project error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   DELETE /api/projects/:id
// @desc    Delete project
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Check if user is owner
    if (project.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Only project owner can delete'
      });
    }

    // Delete all tasks in this project
    await Task.deleteMany({ project: project._id });

    await project.deleteOne();

    // Emit socket event
    const io = req.app.get('io');
    io.to(project._id.toString()).emit('projectDeleted', project._id);

    res.json({
      success: true,
      message: 'Project and all associated tasks deleted successfully'
    });
  } catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   POST /api/projects/:id/members
// @desc    Add member to project
// @access  Private
router.post('/:id/members', auth, [
  body('userId').notEmpty().withMessage('User ID is required')
    .isMongoId().withMessage('Invalid user ID')
], validate, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Check if user is owner
    if (project.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Only project owner can add members'
      });
    }

    const { userId } = req.body;

    // Check if user already a member
    if (project.members.includes(userId)) {
      return res.status(400).json({
        success: false,
        message: 'User is already a member'
      });
    }

    project.members.push(userId);
    await project.save();
    await project.populate('members', 'name email avatar');

    // Emit socket event
    const io = req.app.get('io');
    io.to(project._id.toString()).emit('memberAdded', { projectId: project._id, userId });

    res.json({
      success: true,
      message: 'Member added successfully',
      data: { project }
    });
  } catch (error) {
    console.error('Add member error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   DELETE /api/projects/:id/members/:userId
// @desc    Remove member from project
// @access  Private
router.delete('/:id/members/:userId', auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Check if user is owner
    if (project.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Only project owner can remove members'
      });
    }

    const { userId } = req.params;

    // Cannot remove owner
    if (project.owner.toString() === userId) {
      return res.status(400).json({
        success: false,
        message: 'Cannot remove project owner'
      });
    }

    project.members = project.members.filter(
      member => member.toString() !== userId
    );

    await project.save();
    await project.populate('members', 'name email avatar');

    // Emit socket event
    const io = req.app.get('io');
    io.to(project._id.toString()).emit('memberRemoved', { projectId: project._id, userId });

    res.json({
      success: true,
      message: 'Member removed successfully',
      data: { project }
    });
  } catch (error) {
    console.error('Remove member error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

module.exports = router;
