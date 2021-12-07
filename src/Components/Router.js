import {BrowserRouter, Route,Switch} from 'react-router-dom'
import Home from './home'
import Filter from './filter'
import Details from './details'
import Headers from './header'

function Router(){
    
        return(
            <BrowserRouter>
            <Headers/>
            <Switch>
                
                <Route exact path='/' component={Home}></Route>
                <Route path='/filter' component={Filter}></Route>
                <Route path='/details' component={Details}></Route>
                
            </Switch>
            </BrowserRouter>
        )


    
}
export default Router;