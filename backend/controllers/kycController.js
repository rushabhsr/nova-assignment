import KYC from "../models/KYC.js";
import User from "../models/User.js";


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

    res.status(201).json({ message: "KYC details submitted successfully!", kyc: newKYC });
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
    const kycs = await KYC.find().select("-__v").populate("user", "name email role") || [];
    const users = await User.find({ role: { $ne: "admin" } }).select("-__v -password") || [];
    res.status(200).json({ kycs, users, message: "KYC Details fetched successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Approve or reject KYC (Admin only)
// @route PUT /api/kyc/:id
const updateKYCStatus = async (req, res) => {
  try {
    const { status, rejectionReason } = req.body;

    const kyc = await KYC.findById(req.params.id);
    if (!kyc) {
      return res.status(404).json({ message: "KYC not found" });
    }
    const validStatuses = ["pending", "approved", "rejected"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status update" });
    }
    kyc.status = status;
    if (status === "rejected") {
      kyc.rejectionReason = rejectionReason || "No reason provided";
    } else {
      kyc.rejectionReason = null;
    }
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
          totalUsersSubmittedKyc: { $sum: 1 },
          approvedCount: {
            $sum: { $cond: [{ $eq: ["$status", "approved"] }, 1, 0] }
          },
          rejectedCount: {
            $sum: { $cond: [{ $eq: ["$status", "rejected"] }, 1, 0] }
          }
        }
      },
      {
        $project: {
          totalUsersSubmittedKyc: { $ifNull: ["$totalUsersSubmittedKyc", 0] },
          approvedCount: { $ifNull: ["$approvedCount", 0] },
          rejectedCount: { $ifNull: ["$rejectedCount", 0] }
        }
      }
    ]);

    // If no records are found, counts will be empty
    if (counts.length === 0) {
      counts[0] = {
        totalUsersSubmittedKyc: 0,
        approvedCount: 0,
        rejectedCount: 0
      };
    }

    const totalRegisteredUsers = await User.countDocuments();
    const totalUsersSubmittedKyc = counts[0].totalUsersSubmittedKyc || 0;
    const approvedCount = counts[0].approvedCount || 0;
    const rejectedCount = counts[0].rejectedCount || 0;
    const pendingForVerificationCount = totalUsersSubmittedKyc - (approvedCount + rejectedCount);
    const pendingForSubmissionCount = totalRegisteredUsers - totalUsersSubmittedKyc;

    res.status(200).json({
      message: "KPI stats fetched successfully",
      data: [
        { label: "Total Registered Users", value: totalRegisteredUsers },
        { label: "Total Users Submitted KYC", value: totalUsersSubmittedKyc },
        { label: "Approved", value: approvedCount },
        { label: "Rejected", value: rejectedCount },
        { label: "Pending for Verification", value: pendingForVerificationCount },
        { label: "Pending for Submission", value: pendingForSubmissionCount }
      ]
    });
  } catch (error) {
    console.trace(error)
    res.status(500).json({ message: error.message });
  }
};

const resubmitKYC = async (req, res) => {
  try {
    const { name, email } = req.body;
    const userId = req.user.id;
    const kycId = req.params.id;

    // Find existing KYC record
    const existingKYC = await KYC.findOne({ _id: kycId, user: userId });

    if (!existingKYC) {
      return res.status(404).json({ message: "KYC not found" });
    }

    // Only allow resubmission if the previous KYC was rejected
    if (existingKYC.status !== "rejected") {
      return res.status(400).json({ message: "Only rejected KYC can be resubmitted" });
    }

    // Update KYC details
    existingKYC.name = name || existingKYC.name;
    existingKYC.email = email || existingKYC.email;
    existingKYC.status = "pending"; // Set status back to pending
    existingKYC.rejectionReason = null; // Clear previous rejection reason

    // If a new document is uploaded, update it
    if (req.file) {
      existingKYC.document = req.file.path;
    }

    await existingKYC.save();

    res.status(200).json({ message: "KYC resubmitted successfully", kyc: existingKYC });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error resubmitting KYC" });
  }
};


export { submitKYC, getKYC, getAllKYC, updateKYCStatus, getKPIs, resubmitKYC };
