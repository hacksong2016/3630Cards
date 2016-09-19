Cards = new Mongo.Collection('cards');
Cards.deny({
  insert() { return true; },
  update() { return true; },
  remove() { return true; }
});

Stats = new Mongo.Collection('stats');
Stats.deny({
  insert() { return true; },
  update() { return true; },
  remove() { return true; }
});
