import React, { useState, useContext, useEffect } from "react"
import { SettingsContext } from './SettingsContext';
import { DragDropContext, Droppable } from "react-beautiful-dnd"
import { Typography, Stack, Grid, Paper, Box, Divider } from '@mui/material';
import Card from "./Card"

export default function VisibilitySettings({ visibilityData, refreshStats }) {
    const [columns, setColumns] = useState(visibilityData)

    const onDragEnd = (result, columns, setColumns) => {
        if (!result.destination) return
        const { source, destination } = result
        if (source.droppableId !== destination.droppableId) {
          const sourceColumn = columns[source.droppableId]
          const destColumn = columns[destination.droppableId]
          const sourceItems = [...sourceColumn.items]
          const destItems = [...destColumn.items]
          const [removed] = sourceItems.splice(source.index, 1)
          destItems.splice(destination.index, 0, removed)
          setColumns({
            ...columns,
            [source.droppableId]: {
              ...sourceColumn,
              items: sourceItems,
            },
            [destination.droppableId]: {
              ...destColumn,
              items: destItems,
            },
          })
        } else {
          const column = columns[source.droppableId]
          const copiedItems = [...column.items]
          const [removed] = copiedItems.splice(source.index, 1)
          copiedItems.splice(destination.index, 0, removed)
          setColumns({
            ...columns,
            [source.droppableId]: {
              ...column,
              items: copiedItems,
            },
          })
        }
      }

      useEffect(() => {
            window.api.setVisibilityData(columns);
            refreshStats()
      }, [columns])

    return (
        <Box sx={{ p: 2}}>
        <Grid container direction="row" justifyContent="center" spacing={2}>
        <DragDropContext
          onDragEnd={result => onDragEnd(result, columns, setColumns)}
        >
            <>
              {Object.entries(columns).map(([columnId, column], index) => {
                return (
                    <Grid item xs={6} key={columnId}>
                    <Paper elevation={0} sx={{ p: 1}} key={columnId}>
                    <Droppable key={columnId} droppableId={columnId}>
                        {provided => (
                        <Stack
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                        >
                            <Typography align="center" sx={{fontWeight: 'bold'}}>{column.title}</Typography>
                            <Divider />
                            {column.items.map((item, index) => (
                            <Card key={item.id} item={item} index={index} />
                            ))}
                            {provided.placeholder}
                        </Stack>
                        )}
                    </Droppable>
                    </Paper>
                    </Grid>
                )
              })}
            </>
        </DragDropContext>
        </Grid>
        </Box>
      )
}
