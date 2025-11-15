const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const Task = require('../models/Task');
const Project = require('../models/Project');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');

// @route   GET /api/tasks
// @desc    Get all tasks for logged-in user
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const tasks = await Task.find({
      $or: [
        { assignedTo: req.user._id },
        { createdBy: req.user._id }
      ]
    })
    .populate('project', 'name')
    .populate('assignedTo', 'name email avatar')
    .populate('createdBy', 'name email avatar')
    .populate('comments.user', 'name avatar')
    .sort('-createdAt');

    res.json({
      success: true,
      count: tasks.length,
      data: { tasks }
    });
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   GET /api/tasks/project/:projectId
// @desc    Get all tasks for a project
// @access  Private
router.get('/project/:projectId', auth, async (req, res) => {
  try {
    // Check if user has access to project
    const project = await Project.findById(req.params.projectId);
    
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    if (!project.members.includes(req.user._id)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const tasks = await Task.find({ project: req.params.projectId })
      .populate('assignedTo', 'name email avatar')
      .populate('createdBy', 'name email avatar')
      .populate('comments.user', 'name avatar')
      .sort('-createdAt');

    res.json({
      success: true,
      count: tasks.length,
      data: { tasks }
    });
  } catch (error) {
    console.error('Get project tasks error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   POST /api/tasks
// @desc    Create a new task
// @access  Private
router.post('/', auth, [
  body('title').trim().notEmpty().withMessage('Task title is required')
    .isLength({ min: 3, max: 200 }).withMessage('Title must be between 3-200 characters'),
  body('description').optional().trim().isLength({ max: 1000 })
    .withMessage('Description cannot exceed 1000 characters'),
  body('project').notEmpty().withMessage('Project is required')
    .isMongoId().withMessage('Invalid project ID'),
  body('assignedTo').optional().isMongoId().withMessage('Invalid user ID'),
  body('status').optional().isIn(['todo', 'in-progress', 'done'])
    .withMessage('Invalid status'),
  body('priority').optional().isIn(['low', 'medium', 'high'])
    .withMessage('Invalid priority'),
  body('dueDate').optional().isISO8601().withMessage('Invalid date format')
], validate, async (req, res) => {
  try {
    const { title, description, project, assignedTo, status, priority, dueDate } = req.body;

    // Check if project exists and user has access
    const projectDoc = await Project.findById(project);
    
    if (!projectDoc) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    if (!projectDoc.members.includes(req.user._id)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // If assignedTo is provided, check if user is project member
    if (assignedTo && !projectDoc.members.includes(assignedTo)) {
      return res.status(400).json({
        success: false,
        message: 'Assigned user is not a project member'
      });
    }

    const task = new Task({
      title,
      description,
      project,
      assignedTo,
      createdBy: req.user._id,
      status: status || 'todo',
      priority: priority || 'medium',
      dueDate
    });

    await task.save();
    await task.populate('project', 'name');
    await task.populate('assignedTo', 'name email avatar');
    await task.populate('createdBy', 'name email avatar');

    // Emit socket event
    const io = req.app.get('io');
    io.to(project).emit('taskCreated', task);

    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      data: { task }
    });
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   GET /api/tasks/:id
// @desc    Get task by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('project', 'name members')
      .populate('assignedTo', 'name email avatar')
      .populate('createdBy', 'name email avatar')
      .populate('comments.user', 'name avatar');

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    // Check if user has access
    if (!task.project.members.includes(req.user._id)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    res.json({
      success: true,
      data: { task }
    });
  } catch (error) {
    console.error('Get task error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   PUT /api/tasks/:id
// @desc    Update task
// @access  Private
router.put('/:id', auth, [
  body('title').optional().trim().isLength({ min: 3, max: 200 })
    .withMessage('Title must be between 3-200 characters'),
  body('description').optional().trim().isLength({ max: 1000 })
    .withMessage('Description cannot exceed 1000 characters'),
  body('assignedTo').optional().isMongoId().withMessage('Invalid user ID'),
  body('status').optional().isIn(['todo', 'in-progress', 'done'])
    .withMessage('Invalid status'),
  body('priority').optional().isIn(['low', 'medium', 'high'])
    .withMessage('Invalid priority'),
  body('dueDate').optional().isISO8601().withMessage('Invalid date format')
], validate, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id).populate('project');

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    // Check if user has access
    if (!task.project.members.includes(req.user._id)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const { title, description, assignedTo, status, priority, dueDate } = req.body;

    // If assignedTo is being changed, check if user is project member
    if (assignedTo && !task.project.members.includes(assignedTo)) {
      return res.status(400).json({
        success: false,
        message: 'Assigned user is not a project member'
      });
    }

    if (title) task.title = title;
    if (description !== undefined) task.description = description;
    if (assignedTo !== undefined) task.assignedTo = assignedTo;
    if (status) task.status = status;
    if (priority) task.priority = priority;
    if (dueDate !== undefined) task.dueDate = dueDate;

    await task.save();
    await task.populate('assignedTo', 'name email avatar');
    await task.populate('createdBy', 'name email avatar');
    await task.populate('comments.user', 'name avatar');

    // Emit socket event
    const io = req.app.get('io');
    io.to(task.project._id.toString()).emit('taskUpdated', task);

    res.json({
      success: true,
      message: 'Task updated successfully',
      data: { task }
    });
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   DELETE /api/tasks/:id
// @desc    Delete task
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id).populate('project');

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    // Check if user is task creator or project owner
    const isCreator = task.createdBy.toString() === req.user._id.toString();
    const isOwner = task.project.owner.toString() === req.user._id.toString();

    if (!isCreator && !isOwner) {
      return res.status(403).json({
        success: false,
        message: 'Only task creator or project owner can delete'
      });
    }

    const projectId = task.project._id;
    await task.deleteOne();

    // Emit socket event
    const io = req.app.get('io');
    io.to(projectId.toString()).emit('taskDeleted', task._id);

    res.json({
      success: true,
      message: 'Task deleted successfully'
    });
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   POST /api/tasks/:id/comments
// @desc    Add comment to task
// @access  Private
router.post('/:id/comments', auth, [
  body('text').trim().notEmpty().withMessage('Comment text is required')
    .isLength({ max: 500 }).withMessage('Comment cannot exceed 500 characters')
], validate, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id).populate('project');

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    // Check if user has access
    if (!task.project.members.includes(req.user._id)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const comment = {
      user: req.user._id,
      text: req.body.text,
      createdAt: new Date()
    };

    task.comments.push(comment);
    await task.save();
    await task.populate('comments.user', 'name avatar');

    // Emit socket event
    const io = req.app.get('io');
    io.to(task.project._id.toString()).emit('commentAdded', {
      taskId: task._id,
      comment: task.comments[task.comments.length - 1]
    });

    res.status(201).json({
      success: true,
      message: 'Comment added successfully',
      data: { task }
    });
  } catch (error) {
    console.error('Add comment error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

module.exports = router;
