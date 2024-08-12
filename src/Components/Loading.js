import { Spinner, Modal } from 'reactstrap';
const Loading = (props) => {
    return(
        <Modal isOpen={props.loading} contentClassName="loading-modal">
            <Spinner
                color="primary"
                style={{
                    height: '4rem',
                    width: '4rem',
                }}
                className='loading-spinner'
            >
                Processing...
            </Spinner>
        </Modal>
    )
}

export default Loading;