-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Feb 19, 2026 at 06:22 PM
-- Wersja serwera: 10.4.32-MariaDB
-- Wersja PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `fiszki`
--
CREATE DATABASE IF NOT EXISTS `fiszki` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `fiszki`;

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `fiszki`
--

CREATE TABLE `fiszki` (
  `id` int(2) NOT NULL,
  `slowo` varchar(15) DEFAULT NULL,
  `definicja` varchar(58) DEFAULT NULL,
  `zdanie` varchar(56) DEFAULT NULL,
  `groupid` int(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `fiszki`
--

INSERT INTO `fiszki` (`id`, `slowo`, `definicja`, `zdanie`, `groupid`) VALUES
(48, 'Test1.1', 'Test1.1', 'Test1.1', 68);

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `groups`
--

CREATE TABLE `groups` (
  `id` int(1) NOT NULL,
  `nazwa` varchar(15) DEFAULT NULL,
  `userid` int(1) DEFAULT NULL,
  `private` varchar(5) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `groups`
--

INSERT INTO `groups` (`id`, `nazwa`, `userid`, `private`) VALUES
(68, 'Test1d', 1, NULL),
(70, 'Test2', 1, NULL),
(71, 'Test3', 1, NULL);

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `users`
--

CREATE TABLE `users` (
  `id` int(1) NOT NULL,
  `nazwa` text NOT NULL,
  `email` varchar(8) DEFAULT NULL,
  `haslo` text DEFAULT NULL,
  `tokenVersion` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `nazwa`, `email`, `haslo`, `tokenVersion`) VALUES
(1, 'Test', 'bajojajo', '$2b$10$t4I7xiA7DO2g0z1UYKNT3.8dTUafzgrMStF0t5MHAGWfjK.demEg6', 3),
(2, 'test2', 'brak', '$2b$10$aAygV2osgP7JYbza5UaQ3eSIbfY0QBDqnHnuyX9mxgtYDdtejNMT2', 0),
(3, 'Test3', 'brak', '$2b$10$mM9eic.ss7gBHLpmv74NBuqOLDHqbm4/cna3oHl.6wsKNqtOyFrOK', 0);

--
-- Indeksy dla zrzutów tabel
--

--
-- Indeksy dla tabeli `fiszki`
--
ALTER TABLE `fiszki`
  ADD PRIMARY KEY (`id`),
  ADD KEY `groupid` (`groupid`);

--
-- Indeksy dla tabeli `groups`
--
ALTER TABLE `groups`
  ADD PRIMARY KEY (`id`),
  ADD KEY `userid` (`userid`);

--
-- Indeksy dla tabeli `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `nazwa` (`nazwa`) USING HASH;

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `fiszki`
--
ALTER TABLE `fiszki`
  MODIFY `id` int(2) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=49;

--
-- AUTO_INCREMENT for table `groups`
--
ALTER TABLE `groups`
  MODIFY `id` int(1) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=72;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(1) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `fiszki`
--
ALTER TABLE `fiszki`
  ADD CONSTRAINT `fiszki_ibfk_1` FOREIGN KEY (`groupid`) REFERENCES `groups` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `groups`
--
ALTER TABLE `groups`
  ADD CONSTRAINT `groups_ibfk_1` FOREIGN KEY (`userid`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
