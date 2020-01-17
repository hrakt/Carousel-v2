import React, { Component } from 'react';
import PropTypes from 'prop-types';

import ImgDefault from './ImgDefault';
import Loader from 'components/ui/Loader';

class ImgPreload extends Component {
    static propTypes = {
        alt: PropTypes.string,
        loader: PropTypes.object,
        src: PropTypes.string,
    };

    static defaultProps = {
        loader: <Loader />,
    };

    state = {
        loaded: false,
    };

    componentDidMount() {
        this.preload();
    }

    componentWillUnmount() {
        if (this.instance) {
            this.instance.onload = () => {};
            this.instance.onerror = () => {};
        }
    }

    instance = null;

    preload() {
        const { src } = this.props;
        this.instance = new Image();
        this.instance.onload = () => this.handlePreloadImageLoaded();
        this.instance.onerror = () => this.handlePreloadImageLoaded();
        this.instance.src = src;

        if (this.instance.complete) {
            this.handlePreloadImageLoaded();
        }
    }

    handlePreloadImageLoaded = () => {
        this.setState({ loaded: true });
    };

    render() {
        const { loader, ...props } = this.props;
        const { loaded } = this.state;

        return loaded ? <ImgDefault {...props} /> : loader;
    }
}

export default ImgPreload;
