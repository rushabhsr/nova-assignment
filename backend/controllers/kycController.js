import KYC from "../models/KYC.js";


// @desc Submit KYC
// @route POST /api/kyc
const submitKYC = async (req, res) => {
  try {
    const { name, email } = req.body;
    const userId = req.user.id;

    // Check if KYC already submitted
    const existingKYC = await KYC.findOne({ user: userId });
    if (existingKYC) {
      return res.status(400).json({ message: "KYC already submitted" });
    }

    const newKYC = await KYC.create({
      user: userId,
      name,
      email,
      document: req.file.path,
      status: "pending",
    });

    res.status(201).json(newKYC);
  } catch (error) {
    console.trace(error);
    res.status(500).json({ message: error.message });
  }
};

// @desc Get all KYC submissions (Admin only)
// @route GET /api/kyc
const getKYC = async (req, res) => {
  try {
    const kyc = await KYC.findOne({ user: req.user._id })
      .select("-__v")
      .populate("user", "name email role");

    if (!kyc) {
      return res.status(404).json({ message: "KYC record not found" });
    }

    res.status(200).json({ kyc, message: "KYC Details fetched successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get all KYC submissions (Admin only)
// @route GET /api/kyc
const getAllKYC = async (req, res) => {
  try {
    const kycs = await KYC.find().select("-__v").populate("user", "name email role");
    res.status(200).json({ kycs, message: "KYC Details fetched successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Approve or reject KYC (Admin only)
// @route PUT /api/kyc/:id
const updateKYCStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const kyc = await KYC.findById(req.params.id);

    if (!kyc) {
      return res.status(404).json({ message: "KYC not found" });
    }

    kyc.status = status;
    await kyc.save();

    res.json({ message: `KYC ${status} successfully` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get KPI metrics
// @route GET /api/stats
const getKPIs = async (req, res) => {
  try {
    const counts = await KYC.aggregate([
      {
        $group: {
          _id: null,
          totalUsers: { $sum: 1 },
          approvedCount: {
            $sum: { $cond: [{ $eq: ["$status", "approved"] }, 1, 0] }
          },
          rejectedCount: {
            $sum: { $cond: [{ $eq: ["$status", "rejected"] }, 1, 0] }
          }
        }
      }
    ]);

    const totalUsers = counts[0].totalUsers;
    const approvedCount = counts[0].approvedCount;
    const rejectedCount = counts[0].rejectedCount;
    const pendingCount = totalUsers - (approvedCount + rejectedCount);


    res.status(200).json({
      message: "KPI stats fetched successfully",
      data: {
        totalUsers,
        approvedCount,
        rejectedCount,
        pendingCount,
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { submitKYC, getKYC, getAllKYC, updateKYCStatus, getKPIs };
