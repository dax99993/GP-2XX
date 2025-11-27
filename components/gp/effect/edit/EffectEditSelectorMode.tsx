import { Button, ButtonGroup, ButtonText } from "@/components/ui/button";
import { Center } from "@/components/ui/center";
import { useState } from "react";

function EditModeSelector() {
  const [isEditing, setIsEditing] = useState(true);

  const toggleState = () => {
    setIsEditing(!isEditing);
  }

  return (
    <Center className='bg-secondary-0 px-3 py-2' >
      <ButtonGroup space="xs" flexDirection='row' style={{ flex: 1 }} >
        <Button className='rounded-md '
          variant={isEditing ? 'solid' : 'outline'}
          action="primary"
          style={{ flex: 1 }}
          onPress={()=>(setIsEditing(true))}
        >
            <ButtonText>Edit</ButtonText>
        </Button>
        <Button 
          variant={!isEditing ? 'solid' : 'outline'}
          action="primary"
          style={{ flex: 1 }}
          onPress={()=>(setIsEditing(false))}
        >
          <ButtonText>Patch Settings</ButtonText>
        </Button>
      </ButtonGroup>
    </Center>
  )
}

export default EditModeSelector;