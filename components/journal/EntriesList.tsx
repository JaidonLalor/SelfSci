import { ScrollView, View, Text, Pressable } from "react-native";
import Screen from "../shared/Screen";
import Header from "../shared/Header";
import { JournalEntry } from "@/lib/supabase/journal_entries";
import { useEffect, useState } from "react";
import { fetchJournalEntriesWithStore } from "@/actions/journalEntries";
import { useJournalEntries } from "@/stores/journal_entries";
import { format, parseISO } from "date-fns";
import { styles } from "./EntriesList.styles";
import { useRouter } from "expo-router";
import { Fontisto } from "@expo/vector-icons";
import AddButton from "../shared/AddButton";

type MonthJournal = {
    monthYear: string
    ts: number
    entries: JournalEntry[]
}

export default function EntriesList() {
    const { journalEntries } = useJournalEntries()
    const [sortedEntries, setSortedEntries] = useState<MonthJournal[] | null>(null)
    const router = useRouter()

    useEffect(() => {
        if (!journalEntries) fetchJournalEntriesWithStore()
    }, [])

    useEffect(() => {
        if (journalEntries) {
            
            const groupAndSortJournalEntries = (
                journalEntries: JournalEntry[] = []
            ): MonthJournal[] => {
                return journalEntries
                    .reduce<MonthJournal[]>((acc, entry) => {
                        const monthYear = format(parseISO(entry.entry_timestamp), 'MMMM yyyy')
                        const ts = new Date(monthYear).getTime()
        
                        let group = acc.find(g => g.monthYear === monthYear)
        
                        if (group) {
                            group.entries.push(entry)
                        } else {
                            acc.push({ monthYear, ts, entries: [entry] })
                        }
        
                        return acc
                    }, [])
                    .sort((a, b) => b.ts - a.ts) // Sort months: newest → oldest
                    .map(group => ({
                        ...group,
                        entries: [...group.entries].sort(
                            (a, b) =>
                                new Date(b.entry_timestamp).getTime() -
                                new Date(a.entry_timestamp).getTime()
                        ),
                    }))
            }

            const sortedEntries = groupAndSortJournalEntries(journalEntries)
            setSortedEntries(sortedEntries)
        } else {
            return
        }
    }, [journalEntries])

    const handleSelect = (uuid: string) => {
        router.push(`/journal/${uuid}`)
    }

    const handleNew = () => {
        router.push('/journal/new')
    }

    return (
        <Screen>
            <Header title="Journal"/>
            <ScrollView>
                <View style={styles.content}>
                    {sortedEntries && 
                        sortedEntries.map((entryGroup, index) => (
                            <View key={index}>
                                <View style={styles.monthHeader}>
                                    <Text style={styles.monthTitle}>{entryGroup.monthYear}</Text>
                                    <View style={styles.horizontalLine}/>
                                </View>
                                <View style={styles.monthEntriesContainer}>
                                    {entryGroup.entries &&
                                        entryGroup.entries.map((entry, index) => (
                                            <Pressable
                                                key={index}
                                                style={styles.entryContainer}
                                                onPress={() => handleSelect(entry.id)}
                                            >
                                                <Text style={styles.entryTitle}>{entry.title}</Text>
                                                <Text style={styles.entryDate}>{format(parseISO(entry.created_at), 'MMM d')}</Text>
                                            </Pressable>
                                        ))
                                    }
                                </View>
                            </View>
                        ))
                    }
                </View>
            </ScrollView>

            <AddButton onPress={handleNew}/>
        </Screen>
    )
}