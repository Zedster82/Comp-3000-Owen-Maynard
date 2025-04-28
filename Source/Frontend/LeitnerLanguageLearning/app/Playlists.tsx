import { Dimensions, Pressable, ScrollView, StyleSheet, Text, Touchable, TouchableWithoutFeedback, View } from 'react-native'
import React, { useEffect } from 'react'
import ScreenWrapper from '@/components/ScreenWrapper'
import Typo from '@/components/Typo'
import { Icon } from '@rneui/themed'
import { horizontalScale, verticalScale } from '@/utils/styling'
import { PlaylistType } from '@/types';
import Modal from '@/components/Modal'
import { useModalView } from '@/hooks/useModalView'
import AddPlaylist from '@/components/modals/AddPlaylist'
import { colors } from '@/constants/theme'
import Playlist from '@/components/Playlist'
import { usePlaylists } from "@/hooks/usePlaylists";
import { useMutation, useQuery, useQueryClient } from 'react-query';
import axios from 'axios';
import { useUserID } from '@/hooks/useUserID'

const Playlists = () => {
    const {modalContent, setModalContent, modalVisible, setModalVisible} = useModalView()
    const { playlists, setPlaylists, refreshPlaylists } = usePlaylists();
    
    const {userID, setUserID} = useUserID(); // Custom hook to manage user ID
    const queryClient = useQueryClient();
    


    useEffect(() => {
        refreshPlaylists();
    }, [])
    

    const addNewPlaylist = async (playlistName: string, description: String, cards: string[]) => {
        
        const newPlaylist = {
            userID: userID,
            title: playlistName,
            cardList: cards
        };
        const returnObject = await axios.post(`http://localhost:8282/api/playlists`, newPlaylist)
        setPlaylists([...playlists, returnObject.data.playlist])
        refreshPlaylists();
        setModalVisible(false)
    }

    const openModal = () => { 
        setModalContent(<AddPlaylist returnHandler = {addNewPlaylist} setVisible={setModalVisible}></AddPlaylist>)
    }

    
    return (
        <ScreenWrapper>
            {false ? ( // Remove isLoading logic here, handle loading in provider if needed
                <View style={styles.loadingContainer}>
                    <Typo size={16}>Loading playlists...</Typo>
                </View>
            ) : (
                <>
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
                            <ScrollView style={{ flex: 1 , backgroundColor: colors.neutral800}}>
                                {playlists.map((playlistItem, index) => (
                                    <Playlist key={index} playlistItem={playlistItem} id={playlistItem._id}></Playlist>
                                ))}
                            </ScrollView>
                        </View>
                    </View>
                    <Modal visible={modalVisible} setVisible={setModalVisible}>{modalContent}</Modal>
                </>
            )}                
        </ScreenWrapper>
    )
}

export default Playlists

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    testBorder: {
        // borderColor: 'black',
        // borderBottomWidth: horizontalScale(1),
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }
})