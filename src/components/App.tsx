import React from 'react';
import Phaser from 'phaser';
import MainScene from '../game/scenes/mainScene';
type AppProps = {};
type AppState = {};

export default class App extends React.Component<AppProps, AppState> {
    constructor(props: AppProps) {
        super(props);
        const game = new Phaser.Game({
            title: 'Charlotte Horror',
            backgroundColor: '#000000',
            type: Phaser.WEBGL,
            width: 512,
            height: 512,
            scene: [MainScene],
            scale: {
                mode: Phaser.Scale.FIT,
                autoCenter: Phaser.Scale.CENTER_BOTH,
                parent: 'root',
            },
            physics: {
                default: "arcade",
                arcade: {
                    debug: true,
                }
            }
        });
    }

    render() {
        return <>
            <div id="game-root"></div>
        </>;
    }
}