import React, { useState, useRef, useEffect } from 'react';
import { View, Image, FlatList, TouchableOpacity, Text, Modal, StyleSheet, Dimensions } from 'react-native';
import { SwiperFlatList } from 'react-native-swiper-flatlist';
// import {MaterialCommunityIcons} from '@expo/vector-icons'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS, FONTSTYLES, SIZES } from '../../constants';

const GalleryComponent = ({ images }) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const openModal = (index) => {
    setSelectedImageIndex(index);
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setSelectedImageIndex(null);
    setIsModalVisible(false);
  };

  const goToPreviousImage = () => {
    if (selectedImageIndex > 0) {
      setSelectedImageIndex(selectedImageIndex - 1);
    }
  };

  const goToNextImage = () => {
    if (selectedImageIndex < images.length - 1) {
      setSelectedImageIndex(selectedImageIndex + 1);
    }
  };

  const renderGalleryItem = ({ item, index }) => {
    if (index < 3) {
      return (
        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.imageContainer}
          onPress={() => openModal(index)}
        >
          <Image source={{uri: item}} style={styles.image} resizeMode="cover" />
        </TouchableOpacity>
      );
    } else if (index === 3) {
      return (
        <TouchableOpacity activeOpacity={0.8} style={styles.lastBoxContainer} onPress={() => openModal(index)}>
          <Image source={{uri: item}} style={styles.image} resizeMode="cover" />
          <View style={{ backgroundColor: 'black', opacity: 0.5, flex: 1, position: 'absolute', width: '100%', height: '100%', borderRadius: 10 }}></View>
          <Text style={styles.lastBoxText}>+{images.length - 3}</Text>
        </TouchableOpacity>
      );
    } else {
      return null;
    }
  };

  const scrollRef = useRef();
  const next = (dataLength) => {
    const currentIndex = scrollRef.current.getCurrentIndex()
    // console.log(currentIndex)
    currentIndex == dataLength - 1 ?
    scrollRef.current.goToFirstIndex()
    :
    scrollRef.current.scrollToIndex({index : currentIndex + 1});
  };

  const prev = (dataLength) => {
    const currentIndex = scrollRef.current.getCurrentIndex()
    // console.log(currentIndex)
    currentIndex == 0 ?
    scrollRef.current.goToLastIndex()
    :
    scrollRef.current.scrollToIndex({index : currentIndex - 1});
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={images}
        renderItem={renderGalleryItem}
        keyExtractor={(item, index) => String(index)}
        ListEmptyComponent={() => <Text style={styles.empty}>Tidak tersedia</Text>}
        numColumns={4}
        contentContainerStyle={styles.flatListContainer}
        scrollEnabled={false}
      />

      <Modal visible={isModalVisible} transparent={true} onRequestClose={closeModal}>
        <View style={styles.modalContainer} >
          <TouchableOpacity style={styles.modalCloseButton} onPress={closeModal}>
            <MaterialCommunityIcons name={'close-circle'} size={32} color={'white'} />
            {/* <Text style={styles.modalCloseButtonText}>Close</Text> */}
          </TouchableOpacity>

          {selectedImageIndex !== null && (
            <View style={styles.modalImageContainer}>
              <TouchableOpacity style={styles.modalPreviousButton} onPress={() => prev(images.length)}>
                <MaterialCommunityIcons name={'chevron-left'} size={48} color={'white'} />
                {/* <Text style={styles.modalNavigationButtonText}>{'<'}</Text> */}
              </TouchableOpacity>

              <SwiperFlatList
                // autoplay
                // autoplayDelay={2}
                autoplayLoop
                ref={scrollRef}
                index={selectedImageIndex}
                showPagination
                data={images}
                renderItem={({ item }) => (
                  <View style={[styles.child]}>
                    <Image
                      source={{uri: item}}
                      style={styles.modalImage}
                      resizeMode="center"
                      // onTouchEnd={closeModal}
                    />
                    {/* <Text style={styles.text}>{item}</Text> */}
                  </View>
                )}
              />


              <TouchableOpacity style={styles.modalNextButton} onPress={() => next(images.length)}>
                <MaterialCommunityIcons name={'chevron-right'} size={48} color={'white'} />
                {/* <Text style={styles.modalNavigationButtonText}>{'>'}</Text> */}
              </TouchableOpacity>
            </View>
          )}
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // flex: 1,
  },
  flatListContainer: {
    // paddingVertical: 20,
    // paddingHorizontal: 10,
    marginHorizontal: -5
  },
  imageContainer: {
    flex: 1/4,
    aspectRatio: 1, // Square aspect ratio
    margin: 5,
    backgroundColor: '#C4C4C4',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    flex: 1,
    width: '100%',
    height: '100%',
    borderRadius: 10
  },
  lastBoxContainer: {
    flex: 1,
    aspectRatio: 1, // Square aspect ratio
    margin: 5,
    borderRadius: 10,
    backgroundColor: '#C4C4C4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  lastBoxText: {
    position: 'absolute',
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white'
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCloseButton: {
    position: 'absolute',
    top: 0,
    right: 0,
    zIndex: 99,
    padding: 16,
    // backgroundColor: 'red'
  },
  modalCloseButtonText: {
    color: 'white',
    fontSize: 16,
  },
  modalImageContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalPreviousButton: {
    position: 'absolute',
    justifyContent: 'center',
    padding: 16,
    height: '100%',
    // backgroundColor: 'red',
    // top: '45%',
    left: 0,
    zIndex: 1,
  },
  modalNextButton: {
    position: 'absolute',
    // top: '47%',
    justifyContent: 'center',
    padding: 16,
    height: '100%',
    // backgroundColor: 'red',
    right: 0,
    zIndex: 1,
  },
  modalNavigationButtonText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: 'white',
  },
  modalImage: {
    flex: 1,
    width: Dimensions.get('window').width,
    // height: Dimensions.get('window').height,
    // aspectRatio:
    // height: 200,
    // borderRadius: 10,
  },
  empty: {
    // ...FONTSTYLES.p_black_12,
    ...FONTSTYLES.reg10_7373,
    paddingHorizontal: SIZES.xSmall / 2
  }
});

export default GalleryComponent;
