
import ReactSpeedometer from "react-d3-speedometer";
import VerifyLoan from "../admin/VerifyLoan";
const CibilScoreGauge = (cibile_score) => {
    // console.log(cibile_score, "cibilscore")
    const value = cibile_score.creditScores * 100;
    const creditScores = String(value / 100);
    const segmentStyles = {
        bad: { color: "red" },
        fair: { color: "orange" },
        average: { color: "#ECDB23" },
        good: { color: "#AEE228" },
        excellent: { color: "#6AD72D" }
    };
    return (
        <>
            <div className="App">
                <ul style={{ listStyleType: "disc", display: "flex", justifyContent: "space-between" }}>
                    <li style={segmentStyles.bad}>Bad</li>
                    <li style={segmentStyles.fair}>Fair</li>
                    <li style={segmentStyles.average}>Average</li>
                    <li style={segmentStyles.good}>Good</li>
                    <li style={segmentStyles.excellent}>Excellent</li>
                </ul>
                <div className="d-flex justify-content-center react_speedo_meter">
                    <ReactSpeedometer
                        width={300}
                        height={200}
                        value={value}
                        // needleTransition="easeQuadIn"
                        // needleColor="steelblue"
                        textColor="#555"
                        currentValueText={`Credit Score: ${creditScores}`}
                        // startAngle={-90} // Set the start angle of the needle
                        // endAngle={90} // Set the end angle of the needle
                        customSegmentLabels={[
                            { text: "0-2", position: "INSIDE", color: "#555" },
                            { text: "2-4", position: "INSIDE", color: "#555" },
                            { text: "4-6", position: "INSIDE", color: "#555" },
                            { text: "6-8", position: "INSIDE", color: "#555" },
                            { text: "8-10", position: "INSIDE", color: "#555" },
                        ]}
                    />
                </div>
            </div >

        </>
    );
}
export default CibilScoreGauge;
