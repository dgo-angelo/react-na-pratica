

import { Search, FileDown, MoreHorizontal, Filter } from "lucide-react";
import { Header } from "./components/header";
import { Button } from "./components/ui/button";
import { Tabs } from "./components/tabs";
import { Control, Input } from "./components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./components/ui/table";
import { Pagination } from "./components/pagination";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { useState } from "react";

export interface TagResponse {
  first: number
  prev: number | null
  next: number
  last: number
  pages: number
  items: number
  data: Tag[]
}

export interface Tag {
  title: string
  amountOfVideos: number
  id: string
}


export function App() {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlFilter = searchParams.get('filter') ?? '';
  const [filter, setFilter] = useState(urlFilter); 


  const page = searchParams.get('page') ? Number(searchParams.get('page')) : 1;

  const handleFilterClick = () => {
    setSearchParams(params => {
      params.set('page','1');
      params.set('filter', filter)
      return params;
    })
    
  }

  const { data: tagsResponse, isLoading,} = useQuery<TagResponse>({
    queryKey: ['get-tags', page, urlFilter],
    queryFn: async () => {
      const response = await fetch(`http://localhost:3333/tags?_page=${page}&_per_page=10&title=${urlFilter}`);
      const data = await response.json();
      return data;
    },
    placeholderData: keepPreviousData,
  });

  if (isLoading){
    return null;
  }
  return (
    <div className="py-10 space-y-8">
      <div>
        <Header/>
        <Tabs/>
      </div>
      <main className="max-w-6xl mx-auto space-y-5">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold">Tags</h1>
          <Button variant='primary'></Button>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Input variant='filter'>
              <Search className="size-3"/>
              <Control 
                placeholder="Search tags..."
                onChange={e=>setFilter(e.target.value)}
                value={filter}
              />
            
            </Input>
            <Button onClick={handleFilterClick}>
              <Filter className="size-3" />
              Filter
            </Button>
          </div>
          <Button >
            <FileDown className="size-3" />
            Export
          </Button>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead></TableHead>
              <TableHead>Tag</TableHead>
              <TableHead>Amount of videos</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
           {tagsResponse && tagsResponse.data.length > 0 ? tagsResponse.data.map((tag)=> {
            return (
              <TableRow key={tag.id}>
                <TableCell></TableCell>
                <TableCell>
                  <div className="flex flex-col gap-0.5">
                    <span className="font-medium">{tag.title}</span>
                    <span className="text-xs text-zinc-500">{tag.id}</span>
                  </div>
                </TableCell>
                <TableCell className="text-zinc-500">
                  {tag.amountOfVideos}
                </TableCell>
                <TableCell className="text-right">
                  <Button size="icon">
                    <MoreHorizontal className="size-4"/>
                  </Button>
                </TableCell>
            </TableRow>
           )}): <h1 className="font-medium"> Sem registros</h1>}
          </TableBody>
        </Table>
        {tagsResponse &&  <Pagination pages={tagsResponse.pages} items={tagsResponse.items} page={page}/>}
      </main>
    </div>
  )
}

