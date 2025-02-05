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
      idDocument: req.file.path, // File path from multer
      status: "pending",
    });

    res.status(201).json(newKYC);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get all KYC submissions (Admin only)
// @route GET /api/kyc
const getAllKYC = async (req, res) => {
  try {
    const kycs = await KYC.find().populate("user", "name email role");
    res.status(200).json(kycs);
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

export { submitKYC, getAllKYC, updateKYCStatus };
