import React, { useState, useEffect } from "react"
import { DragDropContext, Droppable } from "react-beautiful-dnd"
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { Typography, Stack, Grid, Paper, Box, Divider, Button } from '@mui/material';
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
            // eslint-disable-next-line
      }, [columns])

      const hideAll = async () => {
          const allStats = columns.visibleStats.items.concat(columns.hiddenStats.items)
          let data = {...columns}
          data.hiddenStats.items = allStats
          data.visibleStats.items = []

          setColumns(data)
      }

      const showAll = async () => {
          const allStats = columns.visibleStats.items.concat(columns.hiddenStats.items)
          let data = {...columns}
          data.visibleStats.items = allStats
          data.hiddenStats.items = []

          setColumns(data)
      }

    return (
        <Box sx={{ p: 1 }}>
        <Grid container direction="row" justifyContent="space-around" spacing={2} sx={{ p: 0 }}>
            <Grid item>
                <Button size="small" sx={{ mb: 1, pt: .5 }} variant="contained" endIcon={<VisibilityIcon />} onClick={showAll} >Show all</Button>
            </Grid>

            <Grid item>
                <Button size="small" sx={{ mb: 1, pt: .5 }} variant="contained" endIcon={<VisibilityOffIcon />} onClick={hideAll} >Hide all</Button>
            </Grid>
        </Grid>
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
