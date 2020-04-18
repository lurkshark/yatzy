import Router from 'preact-router'
import {Main, Gameplay, About} from './scenes'
import './style';

export default function App() {
  return (
    <Router>
      <Main path='/' />
      <Gameplay path='/play' />
      <About path='/about' />
    </Router>
  )
}
