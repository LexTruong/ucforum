import "../css/aboutPage.css"
import yosemite from "../images/yosemite.jpg"

export default function AboutPage() {
    return(
        <div className="aboutpagecontainer">
            <h1>Our goals</h1>
            <h2>Value 1</h2>
            <p className="valuedescription">As Vice President Kamala Harris fights for the votes of Americans threatening to abandon the Democratic Party, she faces challenges across the battleground states, from working-class Nevada communities to Arab American enclaves in Michigan.</p>
            <h2>Value 2</h2>
            <p className="valuedescription">As Vice President Kamala Harris fights for the votes of Americans threatening to abandon the Democratic Party, she faces challenges across the battleground states, from working-class Nevada communities to Arab American enclaves in Michigan.</p>
            <h2>Value 3</h2>
            <p className="valuedescription">As Vice President Kamala Harris fights for the votes of Americans threatening to abandon the Democratic Party, she faces challenges across the battleground states, from working-class Nevada communities to Arab American enclaves in Michigan.</p>
            <h1> About </h1>
            <div className="about">
                <p className="aboutText">A longtime Republican stronghold before President Biden’s victory in 2020, the state is tricky political territory for Democrats, who confront magnified concerns over the number of migrants coming across the U.S.-Mexico border. A handful of polls in recent weeks have shown former President Donald J. Trump leading Ms. Harris by the mid-single digits, even as her numbers have improved in other vital states.</p>
                <img src={yosemite} alt="circleImage"></img>
            </div>
        </div>
    )
}