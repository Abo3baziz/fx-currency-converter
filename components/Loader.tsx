export default function Loader() {
  return (
    <div className="w-screen relative flex items-center">
      <div
        className="h-3 w-[90px] animate-loader absolute right-[50%]"
        style={{
          background:
            "linear-gradient(90deg,#cef739 50%,transparent 0) 0 0, linear-gradient(-90deg,#cef739 50%,transparent 0) 0 0",
          backgroundSize: "20px 100%",
          backgroundRepeat: "repeat-x",
        }}
      />
    </div>
  );
}
