import React, {useRef, useState, useEffect} from 'react';
import {Image} from 'react-native';

export const checkTag = (tag) => {
  var imgSource = '';
  if (tag === 'Home') {
    imgSource = require('../../images/ic_home_address.png');
  } else if (tag === 'Work') {
    imgSource = require('../../images/ic_work.png');
  } else {
    imgSource = require('../../images/ic_others.png');
  }
  return (
    <Image
      source={imgSource}
      style={{
        width: 26,
        height: 26,
      }}
    />
  );
};

export const renderVegOrNonVegImage = (isVeg) => {
  var imgSource = isVeg
    ? require('../../images/veg.png')
    : require('../../images/nonveg.png');
  return (
    <Image
      source={imgSource}
      style={{
        width: 24,
        height: 24,
        marginLeft: 4,
        flex: 0.5,
        resizeMode: 'contain',
      }}
    />
  );
};

export function removeTags(str) {
  if (str === null || str === '') return false;
  else str = str.toString();
  return str.replace(/(<([^>]+)>)/gi, '');
}

export function formatAMPM(date) {
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? '0' + minutes : minutes;
  var strTime = hours + ':' + minutes + ' ' + ampm;
  return strTime;
}

export function isValidInterval(toTime) {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const date = now.getDate();

  var hrs = convertTime12to24(toTime).split(':')[0];
  var min = convertTime12to24(toTime).split(':')[1];

  var given = new Date(year, month, date, hrs, min, 0);

  // console.log(formatAMPM(given) + ' >= ' + formatAMPM(now));
  if (given >= now) {
    return true;
  } else {
    return false;
  }
}

export function filterArrayWithCurrentTime(delivery_times) {
  let filteredArray = [];
  for (let i = 0; i < delivery_times.length; i++) {
    if (i > 0) {
      let s = delivery_times[i];
      if (isValidInterval(s.split('-')[0])) {
        filteredArray.push(delivery_times[i]);
        // Logger.logger("filtered time:" + delivery_times[i]);
      }
    } else {
      filteredArray.push(delivery_times[i]);
    }
  }

  return filteredArray;
}

export const convertTime12to24 = (time12h) => {
  const [time, modifier] = time12h.split(' ');

  let [hours, minutes] = time.split(':');

  if (hours === '12') {
    hours = '00';
  }

  if (modifier === 'pm') {
    hours = parseInt(hours, 10) + 12;
  }

  return `${hours}:${minutes}`;
};

export function isVeg(attributes) {
  let veg = false;
  attributes.forEach((attribute) => {
    if ('food-type' === attribute.slug && attribute.options.length > 0) {
      let options = attribute.options;
      if ('veg' === options[0]) {
        veg = true;
      }
    }
  });
  return veg;
}

export function useFirstRender() {
  const firstRender = useRef(true);

  useEffect(() => {
    firstRender.current = false;
  }, []);

  return firstRender.current;
}

export function getFilterDataOfCategory(getCategory, array) {
  let temp = [];
  for (let index = 0; index < array.length; index++) {
    const categories = array[index].categories;
    for (let indexJ = 0; indexJ < categories.length; indexJ++) {
      const category = categories[indexJ];
      if (category === getCategory) {
        temp.push(array[index]);
      }
    }
  }
  return temp;
}

export function getFilterDataOfVegOrAll(isVeg, array) {
  let temp = [];
  if (isVeg) {
    array.forEach((element) => {
      if (element.isVeg) {
        temp.push(element);
      }
    });
  } else {
    temp = array;
  }
  return temp;
}
