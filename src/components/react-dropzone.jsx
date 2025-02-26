import {useCallback, useState, useEffect} from 'react'
import {useDropzone} from 'react-dropzone'
import FileList from './FileList'
import { ActionButton } from './FileCard'

const formatFileSize = (bytes) => {
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(2)} MB`;
}

const FILE_ICONS = {
    'image/': '🖼️',
    'video/': '🎥',
    'audio/': '🎵',
    'text/': '📄',
    'application/pdf': '📕',
    'application/msword': '📝',
    'application/vnd.openxmlformats-officedocument.wordprocessingml': '📝',
    'application/vnd.ms-excel': '📊',
    'application/vnd.openxmlformats-officedocument.spreadsheetml': '📊',
    'application/vnd.ms-powerpoint': '📽️',
    'application/vnd.openxmlformats-officedocument.presentationml': '📽️',
    'default': '📁'
};

function MyDropzone() {
    const [files, setFiles] = useState([]);
    const [rejectedFiles, setRejectedFiles] = useState([]);
    
    useEffect(() => {
        return () => {
            files.forEach(file => {
                if (file.preview) {
                    URL.revokeObjectURL(file.preview);
                }
            });
            rejectedFiles.forEach(file => {
                if (file.preview) {
                    URL.revokeObjectURL(file.preview);
                }
            });
        };
    }, [files, rejectedFiles]);

    const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
        if(acceptedFiles?.length) {
            setFiles(previousFiles => [...previousFiles, ...acceptedFiles.map(file => Object.assign(file, {
                preview: URL.createObjectURL(file)
            }))]);
        }
        if(rejectedFiles?.length) {
            setRejectedFiles(previousFiles => [...previousFiles, ...rejectedFiles.map(rejection => Object.assign(rejection.file, {
                preview: URL.createObjectURL(rejection.file),
                errors: rejection.errors
            }))]);
        }
    }, []);

    const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop, maxSize: 1024 * 1024 * 20})

    const removeFile = (name) => {
        setFiles(prevFiles => {
            // First find the file
            const fileToRemove = prevFiles.find(file => file.name === name);
            
            // Immediately revoke the URL
            if (fileToRemove?.preview) {
                URL.revokeObjectURL(fileToRemove.preview);
                // Clear the preview property to prevent any rendering attempts
                fileToRemove.preview = undefined;
            }
            
            // Then filter out the file
            return prevFiles.filter(file => file.name !== name);
        });
    }

    const removeRejectedFile = (name) => {
        setRejectedFiles(prevFiles => {
            // First find the file
            const fileToRemove = prevFiles.find(file => file.name === name);
            
            // Immediately revoke the URL
            if (fileToRemove?.preview) {
                URL.revokeObjectURL(fileToRemove.preview);
                // Clear the preview property to prevent any rendering attempts
                fileToRemove.preview = undefined;
            }
            
            // Then filter out the file
            return prevFiles.filter(file => file.name !== name);
        });
    }

    const removeAllFiles = () => {
        files.forEach(file => {
            if (file.preview) {
                URL.revokeObjectURL(file.preview);
            }
        });
        rejectedFiles.forEach(file => {
            if (file.preview) {
                URL.revokeObjectURL(file.preview);
            }
        });
        setFiles([]);
        setRejectedFiles([]);
    };

    const renderPreview = (file) => {
        // Add a guard clause to prevent rendering if preview is undefined
        if (!file.preview) {
            return renderFileIcon(file);
        }

        if (file.type?.startsWith('image/')) {
            return (
                <img 
                    src={file.preview} 
                    alt={file.name} 
                    style={{
                        width: '100px', 
                        height: '100px', 
                        objectFit: 'cover', 
                        borderRadius: '8px'
                    }}
                    onError={() => {
                        // If image fails to load, fall back to icon
                        file.preview = undefined;
                        return renderFileIcon(file);
                    }}
                />
            );
        }
        
        return renderFileIcon(file);
    };

    // Helper function to render file icon
    const renderFileIcon = (file) => {
        const iconKey = Object.keys(FILE_ICONS).find(key => file.type?.startsWith(key)) || 'default';
        const icon = FILE_ICONS[iconKey];

        return (
            <div style={{
                width: '100px',
                height: '100px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#f8f9fa',
                borderRadius: '8px',
                fontSize: '40px'
            }}>
                {icon}
            </div>
        );
    };

    const dropzoneStyle = {
        padding: '50px',
        borderWidth: '2px',
        borderStyle: 'dashed',
        borderColor: '#cccccc',
        borderRadius: '8px',
        backgroundColor: '#fafafa',
        transition: 'all 0.3s ease',
        cursor: 'pointer',
        textAlign: 'center'
    };

    const activeDropzoneStyle = {
        ...dropzoneStyle,
        borderColor: '#2196f3',
        backgroundColor: '#e3f2fd'
    };

    const dropzoneTextStyle = {
        margin: 0,
        fontSize: '1.1rem',
        color: '#666666'
    };

    return (
        <form>
            <div 
                {...getRootProps()} 
                style={isDragActive ? activeDropzoneStyle : dropzoneStyle}
            >
                <input {...getInputProps()} />
                {
                    isDragActive ?
                    <p style={{...dropzoneTextStyle, color: '#2196f3'}}>Drop the files here ...</p> :
                    <p style={dropzoneTextStyle}>
                        Drag and drop some files here, or click to select files
                    </p>
                }
            </div>
            {files.length > 0 && (
                <>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginTop: '20px'
                    }}>
                        <h3 style={{ color: '#28a745', margin: 0 }}>Accepted Files</h3>
                        <ActionButton onClick={removeAllFiles}>
                            Remove All Files
                        </ActionButton>
                    </div>
                    <FileList 
                        files={files}
                        onRemove={removeFile}
                        formatFileSize={formatFileSize}
                        renderPreview={renderPreview}
                    />
                </>
            )}

            {rejectedFiles.length > 0 && (
                <>
                    <div style={{textAlign: 'left'}}>
                        <h3 style={{ marginTop: '20px', color: '#dc3545' }}>Rejected Files</h3>
                    </div>
                    <FileList 
                        files={rejectedFiles}
                        onRemove={removeRejectedFile}
                        formatFileSize={formatFileSize}
                        showErrors={true}
                        gridColumns="repeat(auto-fill, minmax(200px, 1fr))"
                    />
                </>
            )}
        </form>
    )
}

export default MyDropzone