const Claim = require('../models/claimSchema');
const Item = require('../models/itemLostAndFoundPost');
const bcrypt = require('bcrypt');
const sendBrevoEmail = require('../utilities/emailSender');

const getAllClaimsAdmin = async (req, res) => {
  try {
    const claims = await Claim.find()
      .populate({
        path: 'item',
        select: 'title verificationQuestion verificationAnswerHash status imageUrl'
      })
      .populate('claimant', 'username email')
      .sort({ createdAt: -1 });

    // Compare answers securely
    const formattedClaims = await Promise.all(
      claims.map(async (claim) => {
        const isCorrect = await bcrypt.compare(
          claim.answerProvided,
          claim.item.verificationAnswerHash
        );

        return {
          _id: claim._id,
          itemTitle: claim.item.title,
          imageUrl: claim.item.imageUrl,
          verificationQuestion: claim.item.verificationQuestion,
          answerProvided: claim.answerProvided,
          answerMatches: isCorrect,
          message: claim.message,
          status: claim.status,
          claimant: claim.claimant,
          createdAt: claim.createdAt
        };
      })
    );

    res.status(200).json(formattedClaims);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
//get only active claims
const getActiveClaimsAdmin = async (req, res) => {
  try {
    const claims = await Claim.find({status: 'pending'})
      .populate({
        path: 'item',
        select: 'title verificationQuestion verificationAnswerHash status imageUrl'
      })
      .populate('claimant', 'username email')
      .sort({ createdAt: -1 });

    // Compare answers securely
    const formattedClaims = await Promise.all(
      claims.map(async (claim) => {
        const isCorrect = await bcrypt.compare(
          claim.answerProvided,
          claim.item.verificationAnswerHash
        );

        return {
          _id: claim._id,
          itemTitle: claim.item.title,
          imageUrl: claim.item.imageUrl,
          verificationQuestion: claim.item.verificationQuestion,
          answerProvided: claim.answerProvided,
          answerMatches: isCorrect,
          message: claim.message,
          status: claim.status,
          claimant: claim.claimant,
          createdAt: claim.createdAt
        };
      })
    );

    res.status(200).json(formattedClaims);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
//get resolved claims
const getResolvedClaimsAdmin = async (req, res) => {
  try {
    const claims = await Claim.find({status: "approved"})
      .populate({
        path: 'item',
        select: 'title verificationQuestion verificationAnswerHash status imageUrl'
      })
      .populate('claimant', 'username email')
      .sort({ createdAt: -1 });

    // Compare answers securely
    const formattedClaims = await Promise.all(
      claims.map(async (claim) => {
        const isCorrect = await bcrypt.compare(
          claim.answerProvided,
          claim.item.verificationAnswerHash
        );

        return {
          _id: claim._id,
          itemTitle: claim.item.title,
          imageUrl: claim.item.imageUrl,
          verificationQuestion: claim.item.verificationQuestion,
          answerProvided: claim.answerProvided,
          answerMatches: isCorrect,
          message: claim.message,
          status: claim.status,
          claimant: claim.claimant,
          createdAt: claim.createdAt
        };
      })
    );

    res.status(200).json(formattedClaims);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updateClaimStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!['approved', 'rejected'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }

  try {
    const claim = await Claim.findById(id).populate('item').populate('claimant','email username');


    if (!claim) {
      return res.status(404).json({ error: 'Claim not found' });
    }

    claim.status = status;
    await claim.save();

    // If approved, update item status
    if (status === 'approved') {
      claim.item.status = 'claimed';
      await claim.item.save();
    }
    
       const emailTemplate = `
    
        <p>Claim ${status}.</p>
        
      `;
      console.log("Sending email");
    // Call the Brevo email function
    await sendBrevoEmail({
    subject: 'New Claim',
    to: [{ email: claim.claimant.email, name: claim.claimant.username }],
    emailTemplate,
    });

    res.status(200).json({
      message: `Claim ${status}`,
      claim
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


module.exports = { getAllClaimsAdmin, updateClaimStatus, getResolvedClaimsAdmin, getActiveClaimsAdmin };
