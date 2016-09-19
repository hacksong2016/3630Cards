import { Meteor } from 'meteor/meteor';

Meteor.publish('cards', function () {
  return Cards.find({}, {fields: {up: 0, down: 0}, sort: {index: 1, createdAt: -1}, limit: 20});
});

Meteor.publish('cards.admin', function () {
  return Cards.find({index: {$exists: false}}, {sort: {createdAt: -1}, limit: 100});
});

Meteor.publish('stats', function() {
  const lastMidnight = new Date();
  lastMidnight.setHours(0, 0, 0, 0);
  // console.log(lastMidnight);

  const yesterdayMidnight = new Date();
  yesterdayMidnight.setDate(yesterdayMidnight.getDate() - 1);
  yesterdayMidnight.setHours(0, 0, 0, 0);
  // console.log(yesterdayMidnight);

  const now = new Date();
  const firstDay = now.getDate() - now.getDay();
  const thisWeek = new Date(now.setDate(firstDay));
  thisWeek.setHours(0, 0, 0, 0);
  // console.log(thisWeek);

  const lastWeek = new Date(now.setDate(firstDay - 7));
  lastWeek.setHours(0, 0, 0, 0);
  // console.log(lastWeek);

  Counts.publish(this, 'open-today', Stats.find({
    type: 'open',
    createdAt: {$gt: lastMidnight},
  }));
  Counts.publish(this, 'open-yesterday', Stats.find({
    type: 'open',
    createdAt: {$elemMatch: {$gt: yesterdayMidnight, $lt: lastMidnight}},
  }));
  Counts.publish(this, 'open-this-week', Stats.find({
    type: 'open',
    createdAt: {$gt: thisWeek},
  }));
  Counts.publish(this, 'open-last-week', Stats.find({
    type: 'open',
    createdAt: {$elemMatch: {$gt: lastWeek, $lt: thisWeek}},
  }));

  Counts.publish(this, 'swipe-today', Stats.find({
    type: 'swipe',
    createdAt: {$gt: lastMidnight},
  }));
  Counts.publish(this, 'swipe-yesterday', Stats.find({
    type: 'swipe',
    createdAt: {$elemMatch: {$gt: yesterdayMidnight, $lt: lastMidnight}},
  }));
  Counts.publish(this, 'swipe-this-week', Stats.find({
    type: 'swipe',
    createdAt: {$gt: thisWeek},
  }));
  Counts.publish(this, 'swipe-last-week', Stats.find({
    type: 'swipe',
    createdAt: {$elemMatch: {$gt: lastWeek, $lt: thisWeek}},
  }));

  Counts.publish(this, 'upload-today', Stats.find({
    type: 'upload',
    createdAt: {$gt: lastMidnight},
  }));
  Counts.publish(this, 'upload-yesterday', Stats.find({
    type: 'upload',
    createdAt: {$elemMatch: {$gt: yesterdayMidnight, $lt: lastMidnight}},
  }));
  Counts.publish(this, 'upload-this-week', Stats.find({
    type: 'upload',
    createdAt: {$gt: thisWeek},
  }));
  Counts.publish(this, 'upload-last-week', Stats.find({
    type: 'upload',
    createdAt: {$elemMatch: {$gt: lastWeek, $lt: thisWeek}},
  }));
});
