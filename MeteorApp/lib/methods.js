import { Meteor } from 'meteor/meteor';

Meteor.methods({
  'cards.insert'(image, text: text = '') {
    check(image, String);
    check(text, String);

    if (text.length > 10) {
      throw new Meteor.Error('Cards.methods.insert.tooLong', '文字描述最多10个字');
    }

    return Cards.insert({
      image,
      text,
      up: 0,
      down: 0,
      createdAt: new Date(),
    }, (error, result) => {
      if (!error) {
        Meteor.call('sendStats', {
          type: 'upload',
          platform: 'web',
        });
      }
    })
  },
  'cards.remove'(id) {
    return Cards.remove({_id: id});
  }
});
