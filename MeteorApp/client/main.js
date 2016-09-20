import { Template } from 'meteor/templating';
import './main.html';

Template.cards.onCreated(function () {
  this.sortBy = new ReactiveVar('createdAt');
  this.subscribe('cards.admin');
});
Template.cards.helpers({
  cards() {
    const instance = Template.instance();
    const sortBy = instance.sortBy.get();
    let sort = undefined;
    switch (sortBy) {
      case 'createdAt':
        sort = {createdAt: -1};
        break;
      case 'up':
        sort = {up: -1};
        break;
      case 'down':
        sort = {down: -1};
        break;
      default:
        sort = {createdAt: -1};
        break;
    }
    return Cards.find({}, {sort: sort});
  },
  activeIf(sortBy) {
    const instance = Template.instance();
    if (sortBy === instance.sortBy.get()) {
      return 'active';
    } else {
      return '';
    }
  },
});
Template.cards.events({
  'click .js-createdAt'(event, instance) {
    instance.sortBy.set('createdAt');
  },
  'click .js-up'(event, instance) {
    instance.sortBy.set('up');
  },
  'click .js-down'(event, instance) {
    instance.sortBy.set('down');
  },
});

Template.form.onCreated(function () {
  this.imgUrl = new ReactiveVar('');
});
Template.form.helpers({
  imgUrl() {
    const instance = Template.instance();
    return instance.imgUrl.get();
  },
  disabled() {
    const instance = Template.instance();
    const imgUrl = instance.imgUrl.get();
    if (imgUrl.indexOf('image.fami2u.com') > -1) {
      return '';
    } else {
      return 'disabled';
    }
  },
});
Template.form.events({
  'change #image'(event, instance) {
    event.preventDefault();
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      instance.imgUrl.set(e.target.result);
      Meteor.call('ossPutObject', {
        image: e.target.result,
        Bucket: 'fami2u',
        Prefix: 'LZL/3630Cards/',
      }, (error, result) => {
        console.log(result.url);
        instance.imgUrl.set(result.url);
      });
    }
    reader.readAsDataURL(file);
  },
  'submit form'(event, instance) {
    event.preventDefault();

    const image = instance.imgUrl.get();
    const text = event.target.text.value;

    if (!image) {
      alert('请上传照片');
      return;
    }

    Meteor.call('cards.insert', image, text, (error, result) => {
      if (error) {
        console.log(error);
      } else {
        instance.imgUrl.set('');
        event.target.text.value = '';
      }
    });
  },
});

Template.card.events({
  'click .js-delete-card'() {
    if (confirm('确认删除?')) {
      Meteor.call('cards.remove', this._id);
    }
  },
});

Template.table.onCreated(function () {
  this.subscribe('stats');
});
Template.table.helpers({
  openToday() {
    return Counts.get('open-today');
  },
  openYesterday() {
    return Counts.get('open-yesterday');
  },
  openDayRate() {
    const a = Counts.get('open-today');
    const b = Counts.get('open-yesterday');
    if (b === 0) {
      return 'N/A';
    } else {
      const pct = (a - b) / b * 100;
      return `${pct.toFixed(2)}%`;
    }
  },
  openThisWeek() {
    return Counts.get('open-this-week');
  },
  openLastWeek() {
    return Counts.get('open-last-week');
  },
  openWeekRate() {
    const a = Counts.get('open-this-week');
    const b = Counts.get('open-last-week');
    if (b === 0) {
      return 'N/A';
    } else {
      const pct = (a - b) / b * 100;
      return `${pct.toFixed(2)}%`;
    }
  },
  swipeToday() {
    return Counts.get('swipe-today');
  },
  swipeYesterday() {
    return Counts.get('swipe-yesterday');
  },
  swipeDayRate() {
    const a = Counts.get('swipe-today');
    const b = Counts.get('swipe-yesterday');
    if (b === 0) {
      return 'N/A';
    } else {
      const pct = (a - b) / b * 100;
      return `${pct.toFixed(2)}%`;
    }
  },
  swipeThisWeek() {
    return Counts.get('swipe-this-week');
  },
  swipeLastWeek() {
    return Counts.get('swipe-last-week');
  },
  swipeWeekRate() {
    const a = Counts.get('swipe-this-week');
    const b = Counts.get('swipe-last-week');
    if (b === 0) {
      return 'N/A';
    } else {
      const pct = (a - b) / b * 100;
      return `${pct.toFixed(2)}%`;
    }
  },
  uploadToday() {
    return Counts.get('upload-today');
  },
  uploadYesterday() {
    return Counts.get('upload-yesterday');
  },
  uploadDayRate() {
    const a = Counts.get('upload-today');
    const b = Counts.get('upload-yesterday');
    if (b === 0) {
      return 'N/A';
    } else {
      const pct = (a - b) / b * 100;
      return `${pct.toFixed(2)}%`;
    }
  },
  uploadThisWeek() {
    return Counts.get('upload-this-week');
  },
  uploadLastWeek() {
    return Counts.get('upload-last-week');
  },
  uploadWeekRate() {
    const a = Counts.get('upload-this-week');
    const b = Counts.get('upload-last-week');
    if (b === 0) {
      return 'N/A';
    } else {
      const pct = (a - b) / b * 100;
      return `${pct.toFixed(2)}%`;
    }
  },
});
