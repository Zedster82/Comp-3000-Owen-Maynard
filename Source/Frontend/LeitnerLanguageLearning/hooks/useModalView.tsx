import { useRef, useState } from 'react';
import { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { Gesture } from 'react-native-gesture-handler';





export const useModalView = () => {
    const [modalVisible, setModalVisible] = useState(false);
    const [modalContent, setModalContentInner] = useState<React.ReactNode | null>(null);



    const setModalContent = (modalContent: React.ReactNode | null) => {
        setModalVisible(true)
        setModalContentInner(modalContent)
    }

    

    



  return { modalContent, setModalContent, modalVisible, setModalVisible };
};