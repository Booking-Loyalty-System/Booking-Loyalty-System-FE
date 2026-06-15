import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import {OrbitControls, PerspectiveCamera, Float } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { Model } from './car-wash-model.tsx';
import {MovingCar} from "@/shared/moving-car.tsx"; // Import model thật của bạn

export const CarScene = () => {
    return (
        <Canvas shadows dpr={[1, 2]} className="w-full h-full">
            <PerspectiveCamera makeDefault position={[22, 1.6, 4]} fov={35} />

            {/* Thêm ambientLight cực mạnh để triệt tiêu các hốc tối trong model */}
            <ambientLight intensity={0.7} />
            <directionalLight position={[10, 10, 5]} intensity={1} />

            <Suspense fallback={null}>
                {/* Tự tạo ánh sáng dịu để làm nổi bật màu sắc */}
                <ambientLight intensity={0.6} />
                {/* Đèn chiếu chính tạo khối bóng bẩy */}
                <directionalLight position={[5, 10, 5]} intensity={1.5} castShadow />
                {/* Đèn phụ chiếu từ dưới lên chống các góc khuất bị đen kịt */}
                <hemisphereLight args={['#ffffff', '#444444', 0.4]} />
                {/* shadows={false} sẽ tắt cái vùng đen loang lổ đó ngay lập tức */}
                {/*<Stage environment="city" intensity={0.5} adjustCamera={false} shadows={false}>*/}
                    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.3}>
                        <Model scale={0.25} />
                    </Float>

                    <MovingCar/>
                {/*</Stage>*/}
            </Suspense>

            {/* Tạm thời xóa hoặc comment ContactShadows để kiểm tra độ sạch của scene */}
            {/* <ContactShadows position={[0, -0.5, 0]} opacity={0.4} scale={20} blur={2} far={4} />*/}

            <EffectComposer>
                <Bloom luminanceThreshold={0.8} mipmapBlur intensity={1} />
            </EffectComposer>

            <OrbitControls
                enableZoom={true}
                autoRotate={false}
                target={[0, 1.2, 4]}
                minPolarAngle={0}
                maxPolarAngle={Math.PI / 1.8}
            />
        </Canvas>
    );
};
