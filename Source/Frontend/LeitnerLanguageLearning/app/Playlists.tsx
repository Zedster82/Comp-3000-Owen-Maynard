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
import Playlist from '@/components/Playlist'
import { useMutation, useQuery, useQueryClient } from 'react-query';
import axios from 'axios';

const Playlists = () => {
    const {modalContent, setModalContent, modalVisible, setModalVisible} = useModalView()
    const [playlist, setplaylist] = useState<PlaylistType[]>([])
    const userId = 2; // Using fixed user ID 2 as requested
    
    const queryClient = useQueryClient();
    
    // Fetch playlists from API
    const { isLoading, error, data } = useQuery('playlists', async () => {
        const response = await axios.get(`http://localhost:8282/api/playlists/${userId}`);
        return response.data.data;
    });
    
    useEffect(() => {
        if (data) {
            setplaylist(data);
        }
    }, [data]);

    const cards = [
        { ID: 1, title: "Chinese" },
        { ID: 2, title: "Chinese Characters" },
    ]

    const addNewPlaylist = async (playlistName: string, description: String, cards: string[]) => {
        //Send post request to server to add a new playlist

        //On success, get the playlist from the server and add it to the playlist state
        // const newPlaylist: PlaylistType = { _id:"testsgfd", title: playlistName, user: "testUser", cardList: cards }

        // Post request to add a new playlist
        const newPlaylist = {
            userID: userId,
            title: playlistName,
            cardList: cards
        };
        const returnObject = await axios.post(`http://localhost:8282/api/playlists`, newPlaylist)
        

        setplaylist([...playlist, returnObject.data.playlist])
        
        // Refresh the playlists data
        queryClient.invalidateQueries('playlists');

        //Hide the modal
        setModalVisible(false)
    }

    const openModal = () => { 
        setModalContent(<AddPlaylist returnHandler = {addNewPlaylist} setVisible={setModalVisible}></AddPlaylist>)
    }

    
    return (
        <ScreenWrapper>
            {isLoading ? (
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
                                {playlist.map((playlistItem, index) => (
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