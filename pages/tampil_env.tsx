const Tampil: React.FC = () => {
    return (
        <ul>
            <li>{process.env.CLOUDINARY_CLOUD_NAME}</li>
            <li>{process.env.CLOUDINARY_API_KEY}</li>
            <li>{process.env.CLOUDINARY_API_SECRET}</li>
            <li>{process.env.CLOUDINARY_UPLOAD_PRESET}</li>
        </ul>
    )
};

export default Tampil;

