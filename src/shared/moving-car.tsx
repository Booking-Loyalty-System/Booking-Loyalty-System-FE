import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

export const MovingCar = () => {
    const carRef = useRef<THREE.Group>(null);
    const { scene } = useGLTF('/car-optimized.glb');

    // 🌟 Thêm trạng thái 'postStraight' quản lý hành trình sau khi cua xong
    const stageRef = useRef<'straight' | 'waiting' | 'turning' | 'postStraight'>('straight');
    const waitTimeRef = useRef(0);

    // Biến lưu khoảng cách đã đi thẳng sau khi cua
    const postStraightDistanceRef = useRef(0);

    // Xuất phát góc từ -Math.PI / 2 (-90 độ)
    const angleRef = useRef(-Math.PI / 2);

    // ========================================================
    // CẤU HÌNH TỘA ĐỘ VÀ TỐC ĐỘ
    // ========================================================
    const speedStraight = 0.15;      // Tốc độ di chuyển tiến thẳng của xe
    const speedTurn = 0.02;          // Tốc độ khi xe bẻ lái ôm cua
    const postStraightMaxDistance = 4; // 🌟 CHIỀU DÀI ĐOẠN ĐI THẲNG SAU CUA (Bạn có thể tăng/giảm tùy ý)

    const startX = -6;
    const startZ = -0.55;       // Giữ đúng tọa độ lòng buồng rửa của bạn
    const stopX = 3;            // Điểm dừng ngay chính giữa buồng trụ xám để rửa
    const endX = 12;            // Điểm kết thúc đường thẳng để bắt đầu quẹo phải

    const radius = 12.35;        // Bán kính vòng cua

    useFrame((_, delta) => {
        if (!carRef.current) return;

        // BƯỚC 2: XE ĐANG DỪNG LẠI ĐỂ RỬA
        if (stageRef.current === 'waiting') {
            waitTimeRef.current += delta;
            if (waitTimeRef.current > 2.5) {
                stageRef.current = 'straight';
                waitTimeRef.current = 0;
                // Nhích xe qua hẳn điểm stopX để không dính vòng lặp dừng
                carRef.current.position.x = stopX + 0.1;
            }
            return;
        }

        // BƯỚC 1 & 3: XE ĐANG DI CHUYỂN THẲNG TRONG BUỒNG RỬA
        if (stageRef.current === 'straight') {
            carRef.current.position.x += speedStraight;
            carRef.current.position.z = startZ;

            // Giữ đầu xe hướng thẳng ổn định dọc theo buồng rửa
            carRef.current.rotation.set(0, Math.PI / 2, 0);

            // Kiểm tra điểm dừng chính xác tại buồng rửa trung tâm (Bước 2)
            if (carRef.current.position.x >= stopX && carRef.current.position.x < stopX + speedStraight) {
                carRef.current.position.x = stopX;
                stageRef.current = 'waiting';
                return;
            }

            // Kiểm tra nếu chạy tới điểm cuối buồng rửa -> Chuyển trạng thái bẻ lái
            if (carRef.current.position.x >= endX) {
                carRef.current.position.set(endX, 0, startZ);
                angleRef.current = -Math.PI / 2;
                stageRef.current = 'turning';
            }
        }

        // BƯỚC 4: XE QUẸO PHẢI THÀNH VÒNG CUNG RA CHỖ TRỤ ĐEN
        else if (stageRef.current === 'turning') {
            const dynamicCenterX = endX;
            const dynamicCenterZ = startZ + radius;

            // 1. Tăng góc từ từ để xe di chuyển tiến lên trên vòng cung
            angleRef.current += speedTurn;

            // 2. Tính vị trí X và Z hiện tại dựa theo lượng giác lượng tăng góc
            const currentX = dynamicCenterX + Math.cos(angleRef.current) * radius;
            const currentZ = dynamicCenterZ + Math.sin(angleRef.current) * radius;

            carRef.current.position.x = currentX;
            carRef.current.position.z = currentZ;

            // 3. Xoay đầu xe chuẩn xác hướng về phía trước cung đường
            const deltaAngle = angleRef.current - (-Math.PI / 2);
            carRef.current.rotation.set(0, Math.PI / 2 - deltaAngle, 0);

            // 4. Khi góc cua đạt đến 0 radian (Xe đã hoàn thành quẹo vuông góc ra đường đen)
            if (angleRef.current >= 0) {
                // 🌟 CHUYỂN SANG GIAI ĐOẠN ĐI THẲNG SAU CUA thay vì reset ngay
                stageRef.current = 'postStraight';
                postStraightDistanceRef.current = 0; // Reset bộ đếm khoảng cách

                // Khóa chặt góc xoay hướng thẳng theo trục Z (hướng đầu xe lúc này đang quay về góc 0)
                carRef.current.rotation.set(0, 0, 0);
            }
        }

        // BƯỚC 5: 🌟 XE CHẠY THẲNG MỘT ĐOẠN TRÊN ĐƯỜNG ĐEN TRƯỚC KHI LOOP
        else if (stageRef.current === 'postStraight') {
            // Khi xe đạt góc 0 ở bước 4, hướng tiến của xe lúc này sẽ chạy dọc theo trục Z hướng dương (+)
            carRef.current.position.z += speedStraight;

            // Giữ đầu xe hướng thẳng cố định dọc đường đen
            carRef.current.rotation.set(0, 0, 0);

            // Cộng dồn khoảng cách xe đã đi được ở đoạn này
            postStraightDistanceRef.current += speedStraight;

            // Nếu đi đủ xa (vượt quá mốc postStraightMaxDistance) thì tiến hành reset loop
            if (postStraightDistanceRef.current >= postStraightMaxDistance) {
                stageRef.current = 'straight';
                carRef.current.position.set(startX, 0, startZ);
                carRef.current.rotation.set(0, Math.PI / 2, 0);
                angleRef.current = -Math.PI / 2;
                postStraightDistanceRef.current = 0;
            }
        }
    });

    return (
        <group
            ref={carRef}
            position={[startX, 0, startZ]}
            scale={0.007}
        >
            <primitive
                object={scene}
                castShadow
                receiveShadow
                rotation={[0, 0, 0]}
            />
        </group>
    );
};

useGLTF.preload('/car-optimized.glb');