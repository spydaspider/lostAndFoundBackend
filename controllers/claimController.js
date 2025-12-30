const Claim = require('../models/claimSchema');
const Item = require('../models/itemLostAndFoundPost');
const bcrypt = require('bcrypt');
const normalize = (text) => text.toLowerCase().trim();

const submitClaim = async (req, res) => {
  const { itemId, answerKeyword, message } = req.body;

  try {
    if (!itemId || !answerKeyword || !message) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const item = await Item.findById(itemId);
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    
    if (item.status === 'claimed') {
      return res.status(403).json({
        error: 'This item has already been claimed'
      });
    }

    
    const existingUserClaim = await Claim.findOne({
      item: itemId,
      claimant: req.user._id
    });

    if (existingUserClaim) {
      return res.status(409).json({
        error: 'You have already submitted a claim for this item'
      });
    }

    
    const approvedClaimExists = await Claim.findOne({
      item: itemId,
      status: 'approved'
    });

    if (approvedClaimExists) {
      return res.status(403).json({
        error: 'This item already has an approved claim'
      });
    }

    
    const normalizedAnswer = normalize(answerKeyword);

    const isCorrect = await bcrypt.compare(
      normalizedAnswer,
      item.verificationAnswerHash
    );

    if (!isCorrect) {
      return res.status(401).json({
        error: 'Verification answer is incorrect'
      });
    }

    
    const claim = await Claim.create({
      item: itemId,
      claimant: req.user._id,
      answerProvided: normalizedAnswer,
      message
    });

    res.status(201).json({
      message: 'Claim submitted successfully',
      claim
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getMyClaims = async (req, res) => {
  try {
    const claims = await Claim.find({ claimant: req.user._id })
      .populate('item', 'title category imageUrl status')
      .sort({ createdAt: -1 });

    res.status(200).json(claims);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


module.exports = { submitClaim, getMyClaims };

