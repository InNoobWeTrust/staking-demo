import { Alert } from 'reactstrap';

const CAlert = (props) => {
  const { type, alertFlag, onDismiss, aContent } = props

  return (
    <Alert color={type} isOpen={alertFlag} toggle={onDismiss}>
      {aContent}
    </Alert>
  );
}

export default CAlert;