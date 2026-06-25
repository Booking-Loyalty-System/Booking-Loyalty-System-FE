import {useEffect, useState} from "react";
import {Html5Qrcode} from "html5-qrcode";
import {toast} from "sonner";
import {QrCode, Upload, X} from "lucide-react";

interface QrScannerModalProps {
    onClose: () => void;
    onScanSuccess: (decodedText: string) => void;
}

export const QrScannerModal: React.FC<QrScannerModalProps> = ({ onClose, onScanSuccess }) => {
    const [scanMethod, setScanMethod] = useState<'camera' | 'file'>('camera');
    const qrRegionId = "html5qr-code-full-region";

    useEffect(() => {
        if (scanMethod !== 'camera') return;

        const html5Qrcode = new Html5Qrcode(qrRegionId);
        const config = { fps: 10, qrbox: { width: 250, height: 250 } };

        html5Qrcode.start(
            { facingMode: "environment" },
            config,
            (decodedText) => {
                onScanSuccess(decodedText);
                html5Qrcode.stop().catch((err) => console.error("Error stopping QR", err));
            },
            () => { /* Bỏ qua log trượt */ }
        ).catch((err) => {
            console.error("Không thể khởi động Camera:", err);
            toast.error("Không tìm thấy Camera hoặc chưa cấp quyền truy cập!");
            setScanMethod('file');
        });

        return () => {
            if (html5Qrcode.isScanning) {
                html5Qrcode.stop().catch((err) => console.error("Error on unmount stop", err));
            }
        };
    }, [scanMethod, onScanSuccess]);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;
        const file = e.target.files[0];

        const html5Qrcode = new Html5Qrcode("html5qr-file-dummy");
        try {
            const decodedText = await html5Qrcode.scanFile(file, true);
            onScanSuccess(decodedText);
        } catch (err) {
            console.error(err);
            toast.error("Không tìm thấy mã QR hợp lệ trong file ảnh này!");
        }
    };

    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-opacity">
            <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl border border-slate-100 flex flex-col transform transition-all">
                <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-white">
                    <div className="flex items-center gap-3">
                        <div className="bg-blue-50 p-2 rounded-xl">
                            <QrCode className="w-5 h-5 text-blue-600" />
                        </div>
                        <span className="font-bold text-slate-800 text-lg">Quét Mã Đặt Lịch</span>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-600">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-4 bg-slate-50 border-b border-slate-100">
                    <div className="flex bg-slate-200/50 p-1 rounded-xl">
                        <button
                            className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${scanMethod === 'camera' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                            onClick={() => setScanMethod('camera')}
                        >
                            📸 Camera Trực Tiếp
                        </button>
                        <button
                            className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${scanMethod === 'file' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                            onClick={() => setScanMethod('file')}
                        >
                            📁 Tải Ảnh Lên
                        </button>
                    </div>
                </div>

                <div className="p-8 flex flex-col items-center justify-center min-h-[320px] bg-white">
                    {scanMethod === 'camera' ? (
                        <div className="w-full flex flex-col items-center">
                            <div id={qrRegionId} className="w-full max-w-[260px] overflow-hidden rounded-2xl border-4 border-dashed border-blue-200 bg-slate-900 shadow-inner"></div>
                            <p className="text-sm text-slate-500 font-medium mt-6 text-center animate-pulse flex items-center gap-2">
                                <span className="relative flex h-3 w-3">
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                  <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
                                </span>
                                Đang tìm kiếm mã QR...
                            </p>
                        </div>
                    ) : (
                        <div className="w-full">
                            <label className="flex flex-col items-center justify-center w-full h-56 border-2 border-dashed border-slate-300 rounded-2xl cursor-pointer bg-slate-50 hover:bg-blue-50 hover:border-blue-300 transition-all p-4 text-center group">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <div className="bg-white p-4 rounded-full shadow-sm mb-4 group-hover:scale-110 transition-transform">
                                        <Upload className="w-8 h-8 text-blue-500" />
                                    </div>
                                    <p className="mb-2 text-sm text-slate-700 font-bold">Nhấn để tải file QR lên</p>
                                    <p className="text-xs text-slate-400 font-medium">Hỗ trợ PNG, JPG, JPEG</p>
                                </div>
                                <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                            </label>
                            <div id="html5qr-file-dummy" className="hidden"></div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};