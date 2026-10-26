import Card from '@/components/layout/Card'
import H2 from '@/components/style/H2'
import React from 'react'
import { View } from 'react-native'
import ChangeCategoryForm from './ChangeCategoryForm'

type Props = {}

const BatchOperationsPanel = (props: Props) => {
  return (
    <Card>
      <View>
        <H2>Change Category</H2>
        <ChangeCategoryForm />
      </View>
    </Card>
  )
}

export default BatchOperationsPanel
