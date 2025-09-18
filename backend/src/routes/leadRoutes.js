const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { createLead, listLeads, getLead, updateLead, deleteLead } = require('../controllers/leadController');

router.use(authMiddleware);

router.post('/', createLead);
router.get('/', listLeads);
router.get('/:id', getLead);
router.put('/:id', updateLead);
router.delete('/:id', deleteLead);

module.exports = router;
