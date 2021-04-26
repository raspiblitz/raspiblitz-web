const ModalBackground = (props: any) => {
  return (
    <div className='flex items-center justify-center fixed left-0 top-0 w-full h-full z-50 bg-opacity-30 bg-gray-600'>
      {props.children}
    </div>
  );
};

export default ModalBackground;
