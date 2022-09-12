import React from "react"
import { Draggable } from "react-beautiful-dnd"
import { Typography, Paper } from '@mui/material'

export default function Card({ item, index }) {
    return (
        <Draggable key={item.id} draggableId={item.id} index={index}>
          {provided => (
            <div
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
            >
              <Paper sx={{ mt: 1, p: .5}}>
                <Typography align="center">{item.name}</Typography>
              </Paper>
            </div>
          )}
        </Draggable>
      )
}
