import { StyleSheet, Text, Touchable, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { horizontalScale } from '@/utils/styling'
import { PlaylistProps } from '@/types'
import Typo from './Typo'
import { useModalView } from '@/hooks/useModalView'
import AddPlaylist from './modals/AddPlaylist'
import { router } from 'expo-router'

const Playlist = ({
    playlistItem,
    id
}: PlaylistProps) => {


    const {modalContent, setModalContent, modalVisible, setModalVisible} = useModalView()

    const handlePress = () => {
        // router.push(`../app/playlists/${id}`)
        router.push(`/playlists/${id}`)
    }

    


    return (
        <View key={id} style={[{ flexDirection: 'column', height: 'auto' }, styles.testBorder]}>
            <TouchableOpacity onPress={handlePress}>
                <Typo size={12}>{playlistItem.title}</Typo>
            </TouchableOpacity>
            {/* <View style={[{ flex: 1, height: horizontalScale(1) }, styles.testBorder]} /> */}
        </View>
    )
}

export default Playlist

const styles = StyleSheet.create({

    testBorder: {
        // marginVertical: horizontalScale(4),
        // borderRadius: 4,
        // borderWidth: horizontalScale(1),
        // borderColor: 'black',
        paddingVertical: horizontalScale(4),
        // borderColor: 'black',
        // borderBottomWidth: horizontalScale(1),

    }
})