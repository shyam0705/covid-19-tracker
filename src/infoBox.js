import { Card, CardContent, Typography } from '@material-ui/core'
import React from 'react'
import './infoBox.css';
function InfoBox({title,cases,total,onClick,active,isRed,isGrey}) {
    return (
        
            <Card className={`infoBox ${active && "infoBox--selected"} ${active && isRed && "infoBox--isRed"} ${active && isGrey && "infoBox--isGrey"}`}
            onClick={onClick}
            >
                <CardContent>
                    <Typography color="textSecondary" className="infoBox_title">{title}</Typography>
                    <h2 className="infoBox_cases">{cases}</h2>
                    <Typography color="textSecondary" className="infoBox_total">{total} total</Typography>
                </CardContent>
            </Card>

    )
}

export default InfoBox
