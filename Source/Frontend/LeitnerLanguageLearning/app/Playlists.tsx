import { Dimensions, Pressable, ScrollView, StyleSheet, Text, Touchable, TouchableWithoutFeedback, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import ScreenWrapper from '@/components/ScreenWrapper'
import Typo from '@/components/Typo'
import { Icon } from '@rneui/themed'
import { horizontalScale, verticalScale } from '@/utils/styling'
import { PlaylistType } from '@/types';
import Modal from '@/components/Modal'
import { useModalView } from '@/hooks/useModalView'
import AddPlaylist from '@/components/modals/AddPlaylist'
import { colors } from '@/constants/theme'

const Playlists = () => {

    


    const {modalContent, setModalContent, modalVisible, setModalVisible} = useModalView()
    

    const [playlist, setplaylist] = useState<PlaylistType[]>([])

    const testPlaylist = [
        { title: 'Chinese', cardID: 1 },
        { title: 'Chinese Characters', cardID: 2 },
        { title: 'Playlist 3', cardID: 3 },
    ]

    useEffect(() => {
        setplaylist(testPlaylist)
        
        
    }, [])
 

    const cards = [
        { ID: 1, title: "Chinese" },
        { ID: 2, title: "Chinese Characters" },
    ]

    const  addNewPlaylist =  () => {
        const newPlaylist: PlaylistType = { title: 'New Playlist', cardList: ["1"] }
        setplaylist([...playlist, newPlaylist])
        console.log('Add New Playlist')
        //Add a new playlist to the list
    }

    const openModal = () => { 
        setModalContent(<AddPlaylist returnHandler = {addNewPlaylist} setVisible={setModalVisible}></AddPlaylist>)
    }

    
    return (
        <ScreenWrapper>
            <Typo fontWeight={'600'}>Playlists</Typo>
            <View style={{ flex: 1, flexDirection: 'column' }}>
                {/* Header */}
                <View style={{ flex: 0.1 }}>
                    <Pressable onPress={() => {openModal()}} style={[]}>
                        <View style={[{ flexDirection: 'row', alignItems: 'center', flexWrap: 'nowrap' }, styles.container, styles.testBorder]}>
                            <Icon name="add"></Icon>
                            <Typo size={12}>Add New Playlist</Typo>
                        </View>
                    </Pressable>
                </View>
                {/* Body */}
                <View style={{ flex: 0.9 }}>
                    <ScrollView style={{ flex: 1 }}>
                        {playlist.map((playlistItem, index) => (
                            <View key={index} style={[{ flexDirection: 'column',  height: 50 }, styles.testBorder]}>
                                <Typo size={12}>{playlistItem.title}</Typo>
                                <View style={[{flex: 1, height: horizontalScale(1)}, styles.testBorder]}/>
                            </View>
                        ))}
                    </ScrollView>
                </View>
            </View>
            <Modal visible={modalVisible} setVisible={setModalVisible}>{modalContent}</Modal>                
        </ScreenWrapper>
    )
}

export default Playlists

const styles = StyleSheet.create({

    container:
    {
        flex: 1,
    },
    testBorder: {
        
        borderColor: 'black',
        borderBottomWidth: horizontalScale(1),

    }
})