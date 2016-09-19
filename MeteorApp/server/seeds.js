const hasCard = Cards.find().count();

if (hasCard === 0) {
  Cards.insert({text: '左滑是踩', image: 'http://image.fami2u.com/LZL/3630Cards/noun_74544_cc_left.png', up: 0, down: 0, index: 0, createdAt: new Date()});
  Cards.insert({text: '右滑是赞', image: 'http://image.fami2u.com/LZL/3630Cards/noun_74547_cc_right.png', up: 0, down: 0, index: 1, createdAt: new Date()});
}
