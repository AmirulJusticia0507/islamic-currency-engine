const { getCurrentPrice, getHistory } = require("../utils/goldOracle");
const { log } = require("../utils/auditLog");

exports.current = async (req, res) => {
  try {
    const price = await getCurrentPrice({ force: req.query.force === "1" });
    await log(req.user.id, "oracle:current", "GoldPrice", null, { source: price.source });
    res.json({ price });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.history = async (req, res) => {
  try {
    const history = await getHistory(req.query.limit || 30);
    res.json({ history });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};