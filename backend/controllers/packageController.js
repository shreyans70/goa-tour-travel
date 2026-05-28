const Package = require('../models/Package');

// @desc    Get all active packages
// @route   GET /api/packages
const getPackages = async (req, res) => {
  try {
    // If not admin, only show active packages
    const filter = req.user && req.user.role === 'admin' ? {} : { status: 'active' };
    const packages = await Package.find(filter);
    res.json(packages);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get single package
// @route   GET /api/packages/:id
const getPackageById = async (req, res) => {
  try {
    const pkg = await Package.findById(req.params.id);
    if (pkg) {
      res.json(pkg);
    } else {
      res.status(404).json({ message: 'Package not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create a package
// @route   POST /api/packages/admin
const createPackage = async (req, res) => {
  try {
    const pkg = new Package(req.body);
    const createdPackage = await pkg.save();
    res.status(201).json(createdPackage);
  } catch (error) {
    res.status(400).json({ message: 'Invalid package data', error: error.message });
  }
};

// @desc    Update a package
// @route   PUT /api/packages/admin/:id
const updatePackage = async (req, res) => {
  try {
    const pkg = await Package.findById(req.params.id);
    if (pkg) {
      Object.assign(pkg, req.body);
      const updatedPackage = await pkg.save();
      res.json(updatedPackage);
    } else {
      res.status(404).json({ message: 'Package not found' });
    }
  } catch (error) {
    res.status(400).json({ message: 'Invalid package data', error: error.message });
  }
};

// @desc    Delete a package
// @route   DELETE /api/packages/admin/:id
const deletePackage = async (req, res) => {
  try {
    const pkg = await Package.findById(req.params.id);
    if (pkg) {
      await Package.deleteOne({ _id: pkg._id });
      res.json({ message: 'Package removed' });
    } else {
      res.status(404).json({ message: 'Package not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getPackages,
  getPackageById,
  createPackage,
  updatePackage,
  deletePackage
};
