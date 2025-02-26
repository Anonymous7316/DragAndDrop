import PropTypes from 'prop-types'

const FileCard = ({ children, style }) => (
    <div style={{
        padding: '10px',
        backgroundColor: '#fff',
        borderRadius: '8px',
        border: '1px solid #dee2e6',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        wordBreak: 'break-word',
        ...style
    }}>
        {children}
    </div>
);

const DeleteButton = ({ onClick, style }) => (
    <button 
        onClick={onClick}
        style={{
            position: 'absolute',
            top: '-8px',
            right: '-8px',
            width: '20px',
            height: '20px',
            borderRadius: '50%',
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            fontSize: '12px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
            ...style
        }}
        title="Remove file"
        type="button"
    >
        ×
    </button>
);

const ActionButton = ({ onClick, children, style }) => (
    <button
        onClick={onClick}
        style={{
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px',
            ...style
        }}
        type="button"
    >
        {children}
    </button>
);

FileCard.propTypes = {
    children: PropTypes.node.isRequired,
    style: PropTypes.object
};

DeleteButton.propTypes = {
    onClick: PropTypes.func.isRequired,
    style: PropTypes.object
};

ActionButton.propTypes = {
    onClick: PropTypes.func.isRequired,
    children: PropTypes.node.isRequired,
    style: PropTypes.object
};

export { FileCard, DeleteButton, ActionButton }; 