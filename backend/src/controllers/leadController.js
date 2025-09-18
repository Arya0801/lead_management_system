const Lead = require('../models/Lead');

/**
 * Helper: build filter object from query parameters
 * Supported param patterns:
 * - exact: field=value
 * - contains: field_contains=value
 * - in: field_in=a,b,c
 * - numeric: field_gt, field_lt, field_between=a,b
 * - date: field_before=ISO, field_after=ISO, field_between=ISO1,ISO2
 * - boolean: is_qualified=true/false
 *
 */
const buildFilters = (query) => {
  const filter = {};
  const q = { ...query };

  delete q.page;
  delete q.limit;
  delete q.sort; 

  for (const [rawKey, rawVal] of Object.entries(q)) {
    if (rawVal === undefined || rawVal === '') continue;
    const val = rawVal;
    if (rawKey.endsWith('_contains')) {
      const key = rawKey.replace('_contains', '');
      filter[key] = { $regex: val, $options: 'i' };
    } else if (rawKey.endsWith('_in')) {
      const key = rawKey.replace('_in', '');
      filter[key] = { $in: String(val).split(',').map(s => s.trim()) };
    } else if (rawKey.endsWith('_gt')) {
      const key = rawKey.replace('_gt', '');
      filter[key] = { ...(filter[key] || {}), $gt: Number(val) };
    } else if (rawKey.endsWith('_lt')) {
      const key = rawKey.replace('_lt', '');
      filter[key] = { ...(filter[key] || {}), $lt: Number(val) };
    } else if (rawKey.endsWith('_between')) {
      const key = rawKey.replace('_between', '');
      const parts = String(val).split(',').map(s => s.trim());
      if (parts.length === 2) {
        const a = isNaN(parts[0]) ? new Date(parts[0]) : Number(parts[0]);
        const b = isNaN(parts[1]) ? new Date(parts[1]) : Number(parts[1]);
        filter[key] = { $gte: a, $lte: b };
      }
    } else if (rawKey.endsWith('_before')) {
      const key = rawKey.replace('_before', '');
      filter[key] = { ...(filter[key] || {}), $lt: new Date(val) };
    } else if (rawKey.endsWith('_after')) {
      const key = rawKey.replace('_after', '');
      filter[key] = { ...(filter[key] || {}), $gt: new Date(val) };
    } else if (rawKey === 'is_qualified') {
      filter.is_qualified = String(val) === 'true';
    } else {
      filter[rawKey] = val;
    }
  }

  return filter;
};

const createLead = async (req, res, next) => {
  try {
   const lead = await Lead.create({ ...req.body, owner: req.user._id });
    res.status(201).json({ data: lead });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: 'Lead with that email already exists' });
    }
    next(err);
  }
};

const listLeads = async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page || '1', 10));
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit || '20', 10)));
    const skip = (page - 1) * limit;

     const filters = { ...buildFilters(req.query), owner: req.user._id };

    let sort = { created_at: -1 };
    if (req.query.sort) {
      const [field, dir] = String(req.query.sort).split(':');
      sort = { [field]: dir === 'asc' ? 1 : -1 };
    }

    const [total, data] = await Promise.all([
      Lead.countDocuments(filters),
      Lead.find(filters).sort(sort).skip(skip).limit(limit)
    ]);

    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
      data,
      page,
      limit,
      total,
      totalPages
    });
  } catch (err) {
    next(err);
  }
};

const getLead = async (req, res, next) => {
  try {
    const id = req.params.id;
    const lead = await Lead.findOne({ _id: id, owner: req.user._id });
    if (!lead) return res.status(404).json({ message: 'Lead not found' });
    res.status(200).json({ data: lead });
  } catch (err) {
    next(err);
  }
};

const updateLead = async (req, res, next) => {
  try {
    const id = req.params.id;
    const payload = req.body;
    const lead = await Lead.findOneAndUpdate(
      { _id: id, owner: req.user._id },
      payload,
      { new: true, runValidators: true }
    );
    if (!lead) return res.status(404).json({ message: 'Lead not found' });
    res.status(200).json({ data: lead });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: 'Email already in use by another lead' });
    }
    next(err);
  }
};

const deleteLead = async (req, res, next) => {
  try {
    const id = req.params.id;
    const lead = await Lead.findOneAndDelete({ _id: id, owner: req.user._id });
    if (!lead) return res.status(404).json({ message: 'Lead not found' });
    res.status(200).json({ message: 'Lead deleted' });
  } catch (err) {
    next(err);
  }
};

module.exports = { createLead, listLeads, getLead, updateLead, deleteLead };
