import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, Image } from 'react-native';
import Meteor, { createContainer } from 'react-native-meteor';
import SwipeCards from 'react-native-swipe-cards';
import Spinner from 'react-native-loading-spinner-overlay';

if (process.env.NODE_ENV === 'production') {
  Meteor.connect('ws://3630.fami2x.com/websocket');
} else {
  Meteor.connect('ws://localhost:3000/websocket');
}

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    borderRadius: 5,
    overflow: 'hidden',
    borderColor: 'grey',
    backgroundColor: 'white',
    borderWidth: 1,
    elevation: 1,
  },
  thumbnail: {
    flex: 1,
    width: 300,
    height: 300,
  },
  text: {
    fontSize: 20,
    paddingTop: 10,
    paddingBottom: 10
  },
  noMoreCards: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  yup: {
    position: 'absolute',
    top: 20,
    right: 20,
  },
  nope: {
    position: 'absolute',
    top: 20,
    left: 20,
  },
  yupText: {
    fontSize: 64,
    backgroundColor: 'rgba(0, 0, 0, 0)',
    color: 'green',
  },
  nopeText: {
    fontSize: 64,
    backgroundColor: 'rgba(0, 0, 0, 0)',
    color: 'red',
  },
})

const Card = ({text: text = '', image}) => {
  if (image.indexOf('png') > 0) {
    image += '@_600w.png';
  } else if (image.indexOf('gif') > 0) {
    image += '@_600w.gif';
  } else {
    image += '@_600w.jpg';
  }

  return (
    <View style={styles.card}>
      <Image style={styles.thumbnail} source={{uri: image}} />
      {text ? <Text style={styles.text}>{text}</Text> : <View />}
    </View>
  )
}

const NoMoreCards = () => (
  <View style={styles.noMoreCards}>
    <Text>前往 3630.fami2x.com 上传你的海钓瞬间</Text>
  </View>
)

const Tinder = ({isReady, cards}) => {
  if (isReady) {
    return (
      <SwipeCards
        cards={cards}
        loop={false}

        renderCard={(cardData) => <Card {...cardData} />}
        renderNoMoreCards={() => <NoMoreCards />}
        showYup={true}
        showNope={true}

        handleYup={handleYup}
        handleNope={handleNope}
        cardRemoved={cardRemoved}

        yupText={(Platform.OS === 'ios') ? '👍🏼' : '赞'}
        noText={(Platform.OS === 'ios') ? '👎🏼' : '踩'}
        yupStyle={styles.yup}
        nopeStyle={styles.nope}
        yupTextStyle={styles.yupText}
        nopeTextStyle={styles.nopeText}
      />
    )
  } else {
    return (
      <View style={{ flex: 1 }}>
        <Spinner visible={true} color={'black'} overlayColor={'#F5FCFF'} />
      </View>
    )
  }
}

function handleYup(card) {
  console.log("yup", card);
  // Meteor.collection('cards').update(card._id, {$inc: {up: 1}});
  Meteor.call('up', card._id);
}

function handleNope(card) {
  console.log("nope", card);
  // Meteor.collection('cards').update(card._id, {$inc: {down: 1}});
  Meteor.call('down', card._id);
}

function cardRemoved() {
  Meteor.call('sendStats', {
    type: 'swipe',
    platform: Platform.OS,
  });
}

Tinder.propTypes = {
  isReady: React.PropTypes.bool,
  cards: React.PropTypes.array,
};

const TinderWithData = createContainer(() => {
  const handle = Meteor.subscribe('cards');
  return {
    isReady: handle.ready(),
    cards: Meteor.collection('cards').find({}, {sort: {index: -1, createdAt: -1}}),
  };
}, Tinder);

// const RNApp = () => <TinderWithData style={{flex: 1}} />;

class RNApp extends Component {
  componentDidMount() {
    Meteor.call('sendStats', {
      type: 'open',
      platform: Platform.OS,
    });
  }

  render() {
    return <TinderWithData style={{flex: 1}} />;
  }
}

export default RNApp;
