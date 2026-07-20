import React, {useEffect} from 'react'
import Card from './card'
import CardText from './Details'
import Modal from './Modals/Modal'
import Navbar from '../common/Navbar'

const Main = () => {
    useEffect(() => {
        document.title = 'Create a New Card';
    }, [])
    
    return (
        <>
        <Navbar />
        {/* Card Container */}
        <div className='relative w-full h-[calc(100vh-56px)] card_con'>
        {/* Card */}
        <Card/>
        {/* Card Text */}
        <CardText/>
        {/* Modal */}
        <Modal/>
        </div>
        </>
    )
}

export default Main