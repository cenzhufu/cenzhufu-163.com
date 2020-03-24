import React from 'react'
import MyScroll from './MyScroll';

class Footer extends React.Component{
    render() {
        return (
            <div className='footer'>
                <footer>
                    <h4>这是页面底部</h4>
                </footer>
                < MyScroll />
            </div>
        )
    }
}

export default Footer
