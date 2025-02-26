import PropTypes from 'prop-types'
import { FileCard, DeleteButton } from './FileCard';

const FileList = ({ 
    files, 
    onRemove, 
    formatFileSize,
    renderPreview,
    showErrors = false,
    gridColumns = 'repeat(auto-fill, minmax(120px, 1fr))'
}) => (
    <ul style={{ 
        listStyle: 'none', 
        padding: 0,
        display: 'grid',
        gridTemplateColumns: gridColumns,
        gap: '1rem',
        justifyItems: 'center'
    }}>
        {files.map((file, index) => (
            <li key={index} style={{ 
                marginBottom: '1rem', 
                position: 'relative', 
                width: '100%',
                maxWidth: showErrors ? '200px' : '120px'
            }}>
                <div style={{ position: 'relative' }}>
                    <FileCard>
                        <div style={{
                            marginBottom: '10px',
                            display: 'flex',
                            justifyContent: 'center'
                        }}>
                            {renderPreview && renderPreview(file)}
                        </div>
                        
                        <div style={{ 
                            fontSize: '14px', 
                            color: '#495057',
                            textAlign: 'center'
                        }}>
                            <div style={{
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap'
                            }}>
                                {file.name}
                            </div>
                            <div style={{ 
                                color: '#6c757d',
                                fontSize: '12px',
                                marginTop: '4px'
                            }}>
                                {formatFileSize(file.size)}
                            </div>
                        </div>
                        
                        {showErrors && file.errors && file.errors.map((error, i) => (
                            <div key={i} style={{ 
                                fontSize: '12px', 
                                color: '#dc3545',
                                marginTop: '8px',
                                wordWrap: 'break-word',
                                textAlign: 'center'
                            }}>
                                {'File is Larger than 20 MB'}
                            </div>
                        ))}
                    </FileCard>
                    <DeleteButton onClick={(e) => {
                        e.stopPropagation();
                        onRemove(file.name);
                    }} />
                </div>
            </li>
        ))}
    </ul>
);

FileList.propTypes = {
    files: PropTypes.arrayOf(PropTypes.shape({
        name: PropTypes.string.isRequired,
        size: PropTypes.number.isRequired,
        errors: PropTypes.arrayOf(PropTypes.shape({
            message: PropTypes.string.isRequired
        }))
    })).isRequired,
    onRemove: PropTypes.func.isRequired,
    formatFileSize: PropTypes.func.isRequired,
    renderPreview: PropTypes.func,
    showErrors: PropTypes.bool,
    gridColumns: PropTypes.string
};

export default FileList; 