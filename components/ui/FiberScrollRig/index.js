import React, { Suspense } from 'react';

import { Canvas, Dom, useLoader } from 'react-three-fiber';
import { TextureLoader, LinearFilter, Color } from 'three';

import { Block, useBlock } from './Blocks';
import Content from './Content';
import Intro from './Intro';
import BoxGradient from './BoxGradient';
import BoxGlass from './BoxGlass';

import config from './config';
import styles from './FiberScrollRig.scss';

const Pages = () => {
    const imagesItems = [];
    config.blocks.map(item => {
        imagesItems.push(item.image);
    });
    const textures = useLoader(TextureLoader, imagesItems);
    const imageTextures = textures.map(
        texture => ((texture.minFilter = LinearFilter), texture)
    );
    const { contentMaxWidth, mobile } = useBlock();
    const aspect = 1.25;
    const pixelWidth = contentMaxWidth * config.zoom;

    return (
        <>
            {config.blocks.map((block, i) => {
                return (
                    <Block factor={1.5} offset={i} key={i}>
                        <Content image={imageTextures[i]} aspectRatio={aspect}>
                            <Dom
                                style={{
                                    width: pixelWidth / (mobile ? 1 : 2),
                                }}
                                position={[
                                    -contentMaxWidth / 2,
                                    -contentMaxWidth / 2 / aspect - 0.4,
                                    1,
                                ]}
                            >
                                {block.caption}
                            </Dom>
                        </Content>
                    </Block>
                );
            })}
        </>
    );
};

const FiberScrollRig = () => {
    const box1colorA = new Color(0x74ebd5);
    const box1colorB = new Color(0xacb6e5);
    const box2colorA = new Color(0xff0084);
    const box2colorB = new Color(0xe73827);
    const box3colorA = new Color(0xc18bfa);
    const box3colorB = new Color(0x07f8f6);
    const box4colorA = new Color(0xe2629d);
    const box4colorB = new Color(0x4bb9d1);
    // const box5colorA = new Color(0xecd547);
    // const box5colorB = new Color(0xf44164);
    const box6colorA = new Color(0xbbe3f8);
    const box6colorB = new Color(0xed95e0);

    return (
        <div className={styles.container}>
            {/* CANVAS START */}
            <Canvas
                className={styles.canvas}
                orthographic
                camera={{ zoom: config.zoom, position: [0, 0, 500] }}
            >
                <Suspense fallback={<Dom center>Loading...</Dom>}>
                    <ambientLight />
                    <pointLight position={[10, 10, 10]} />
                    <Pages />
                    <Block factor={5} offset={0.9}>
                        <Content>
                            <BoxGradient
                                position={[-1.2, 0, 1]}
                                colorA={box1colorA}
                                colorB={box1colorB}
                            />
                            <BoxGradient
                                position={[1.7, -7, 1]}
                                colorA={box2colorA}
                                colorB={box2colorB}
                            />
                            <BoxGradient
                                position={[-2.4, -4, 0]}
                                colorA={box2colorA}
                                colorB={box6colorB}
                            />
                            <BoxGradient
                                position={[2.4, -5, 1]}
                                colorA={box3colorA}
                                colorB={box3colorB}
                            />
                            <BoxGradient
                                position={[7, -8.4, 1]}
                                colorA={box4colorA}
                                colorB={box4colorB}
                            />
                            <BoxGradient
                                position={[-4, -8.8, 1]}
                                colorA={box1colorA}
                                colorB={box6colorB}
                            />
                            <BoxGradient
                                position={[0, -11.3, 1]}
                                colorA={box6colorA}
                                colorB={box6colorB}
                            />
                            <BoxGlass position={[1.2, 1, 5]} />
                            <BoxGlass position={[-1.2, -6, 1]} />
                            <BoxGlass position={[-2.2, -8, 0.5]} />
                            <BoxGlass position={[3.2, -9, 0.5]} />
                            <BoxGlass position={[2.5, -2, -0.5]} />
                            <BoxGlass position={[-1.2, 4, 0]} />
                            <BoxGlass position={[0, -4, 0]} />
                            <BoxGlass position={[-1.2, -10, 0]} />
                            <BoxGlass position={[-4.2, -11, 0]} />
                            <BoxGlass position={[6.2, -10, 0.5]} />
                            <BoxGlass position={[2.9, -12, -0.5]} />
                            <BoxGlass position={[-3.6, -14, 1]} />
                            <BoxGlass position={[-5, -6, 1]} />

                            <BoxGlass position={[-1000, -4, 5]} />
                        </Content>
                    </Block>
                    <Intro />
                </Suspense>
            </Canvas>
            <div
                className={styles.pageLength}
                style={{ height: `${config.blocks.length * 100}vh` }}
            />
        </div>
    );
};

export default FiberScrollRig;
