import React from "react";
import { Text, View } from "react-native";
import { Agenda, AgendaList, CalendarProvider } from "react-native-calendars";

function AgendaPage({ navigation, route }) {
  return (
    <View
      style={{
        paddingTop: 50,
        width: 400,
        height: "100%",
      }}
    >
      <Agenda
        items={{
          "2023-03-22": [{ name: "item 1 - any js object" }],
          "2023-03-23": [{ name: "item 2 - any js object", height: 80 }],
          "2023-03-24": [{ name: "item 3" }],
          "2023-03-25": [
            { name: "item 4 - any js object" },
            { name: "any js object" },
          ],
          "2023-03-26": [{ name: "item 1 - any js object" }],
          "2023-03-27": [{ name: "item 2 - any js object", height: 80 }],
          "2023-03-28": [{ name: "item 3" }],
          "2023-03-29": [
            { name: "item 4 - any js object" },
            { name: "any js object" },
          ],
        }}
        selected={"2023-03-23"}
        minDate={"2022-01-01"}
        maxDate={"2024-01-01"}
        pastScrollRange={50}
        futureScrollRange={50}
        renderItem={(item, firstItemInDay) => {
          let a = 0;
          return (
            <View
              style={{
                justifyContent: "center",
                width: "100%",
                height: 30,
                backgroundColor: `rgba(0,0,256,1)`,
              }}
            >
              <Text>{item.name}</Text>
            </View>
          );
        }}
        // renderDay={(day, item) => {
        //   return (
        //     <View style={{ backgroundColor: "green", width: 100, height: 100 }}>
        //       <Text>{item.name}</Text>
        //     </View>
        //   );
        // }}
        renderEmptyDate={() => {
          return (
            <View
              style={{
                justifyContent: "center",
                width: "100%",
                height: 30,
                backgroundColor: `rgba(0,0,256,1)`,
              }}
            />
          );
        }}
        // renderKnob={() => {
        //   return <View />;
        // }}
        markedDates={{
          "2023-03-16": { selected: true, marked: true },
          "2023-03-17": { marked: true },
          "2023-03-18": { disabled: true },
        }}
        onRefresh={() => console.log("refreshing...")}
        refreshing={false}
        refreshControl={null}
        // theme={{
        //   //   ...calendarTheme,
        //   agendaDayTextColor: "yellow",
        //   agendaDayNumColor: "green",
        //   agendaTodayColor: "red",
        //   agendaKnobColor: "blue",
        // }}
        style={{}}
      />
    </View>
  );
}

export default AgendaPage;
